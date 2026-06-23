"use client";

import { MagnifyingGlass, X } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RegionLevel } from "@/lib/regions";

interface SearchResult {
  code: string;
  name: string;
  level: RegionLevel;
  path: { code: string; name: string }[];
  score: number;
}

interface SearchResponse {
  data: SearchResult[];
  meta: {
    count: number;
    level: "search";
    query: string;
  };
}

export interface GlobalSearchSelection {
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
}

interface GlobalSearchProps {
  onSelect: (selection: GlobalSearchSelection) => void;
}

const LEVEL_LABELS: Record<RegionLevel, string> = {
  provinces: "Provinsi",
  regencies: "Kab/Kota",
  districts: "Kecamatan",
  villages: "Desa/Kel",
};

function selectionFromResult(result: SearchResult): GlobalSearchSelection {
  const code = result.code;
  const base = {
    province: code.slice(0, 2),
    regency: code.length >= 4 ? code.slice(0, 4) : undefined,
    district: code.length >= 6 ? code.slice(0, 6) : undefined,
    village: code.length >= 10 ? code : undefined,
  };

  if (result.level === "provinces") return { province: code };
  if (result.level === "regencies") return { province: base.province, regency: code };
  if (result.level === "districts") {
    return { province: base.province, regency: base.regency, district: code };
  }
  return {
    province: base.province,
    regency: base.regency,
    district: base.district,
    village: code,
  };
}

function formatPath(path: { name: string }[]): string {
  return path.map((segment) => segment.name).join(" › ");
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function HighlightName({ name, query }: { name: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{name}</>;

  const normalized = trimmed.toLocaleLowerCase("id-ID");
  const regex = new RegExp(`(${escapeRegExp(normalized)})`, "gi");
  const parts = name.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        part.toLocaleLowerCase("id-ID") === normalized ? (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  );
}

export function GlobalSearch({ onSelect }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback(async (term: string) => {
    const trimmed = term.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setStatus("idle");
      setIsOpen(false);
      return;
    }

    setStatus("loading");
    try {
      const response = await fetch(`/api/regions?level=search&q=${encodeURIComponent(trimmed)}`);
      const payload = (await response.json()) as SearchResponse | { error?: string };
      if (!response.ok || !("data" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "Pencarian gagal.");
      }
      setResults(payload.data);
      setStatus("success");
      setActiveIndex(-1);
      setIsOpen(true);
    } catch {
      setStatus("error");
      setResults([]);
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      void search(query);
    }, 150);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;
      const root = inputRef.current?.closest(".global-search");
      if (root && !root.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const activeItem = listRef.current.children[activeIndex];
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || results.length === 0) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((current) => (current + 1) % results.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((current) => (current - 1 + results.length) % results.length);
        break;
      case "Enter":
        event.preventDefault();
        if (activeIndex >= 0) {
          selectResult(results[activeIndex]);
        } else if (results.length > 0) {
          selectResult(results[0]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }

  function selectResult(result: SearchResult) {
    onSelect(selectionFromResult(result));
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  }

  function clearQuery() {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div className="global-search">
      <label className="sr-only" htmlFor="global-search-input">
        Cari wilayah di seluruh Indonesia
      </label>
      <div
        className="global-search-input-wrap"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? "global-search-results" : undefined}
        aria-haspopup="listbox"
      >
        <MagnifyingGlass className="global-search-icon" size={20} aria-hidden="true" />
        <input
          ref={inputRef}
          id="global-search-input"
          className="global-search-input"
          type="search"
          placeholder="Cari provinsi, kabupaten, kecamatan, atau desa…"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          aria-autocomplete="list"
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `search-result-${results[activeIndex]?.code}` : undefined
          }
        />
        {query ? (
          <button
            type="button"
            className="global-search-clear"
            onClick={clearQuery}
            aria-label="Bersihkan pencarian"
          >
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {status === "loading" ? (
        <div className="global-search-status" role="status" aria-live="polite">
          Mencari…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="global-search-status is-error" role="alert">
          Pencarian gagal. Coba lagi.
        </div>
      ) : null}

      {isOpen && status === "success" && results.length === 0 ? (
        <div className="global-search-status" role="status">
          Tidak ada hasil untuk &quot;{query.trim()}&quot;.
        </div>
      ) : null}

      {isOpen && results.length > 0 ? (
        <ul
          ref={listRef}
          id="global-search-results"
          className="global-search-results"
          role="listbox"
          aria-label="Hasil pencarian wilayah"
        >
          {results.map((result, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={result.code}
                id={`search-result-${result.code}`}
                className={`global-search-result${isActive ? " is-active" : ""}`}
                role="option"
                aria-selected={isActive}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectResult(result)}
              >
                <div className="global-search-result-main">
                  <span className="global-search-result-name">
                    <HighlightName name={result.name} query={query} />
                  </span>
                  <span className="global-search-result-level">{LEVEL_LABELS[result.level]}</span>
                </div>
                <div className="global-search-result-meta">
                  <span className="global-search-result-code" translate="no">
                    {result.code}
                  </span>
                  {result.path.length > 0 ? (
                    <span className="global-search-result-path">{formatPath(result.path)}</span>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
