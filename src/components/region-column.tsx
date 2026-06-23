"use client";

import {
  CaretRight,
  Check,
  CopySimple,
  MagnifyingGlass,
  MapPin,
  WarningCircle,
} from "@phosphor-icons/react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { Region } from "@/lib/regions";

export type ColumnStatus = "idle" | "loading" | "success" | "error";

interface RegionColumnProps {
  title: string;
  levelLabel: string;
  placeholder: string;
  hint: string;
  status: ColumnStatus;
  regions: Region[];
  selectedCode?: string;
  copiedCode?: string;
  canSelectChildren: boolean;
  error?: string;
  onSelect: (region: Region) => void;
  onCopy: (region: Region) => void;
  onRetry: () => void;
  mobileActive?: boolean;
  mobileStepIndex?: number;
}

function SkeletonList() {
  return (
    <ul className="skeleton-list" aria-label="Memuat data wilayah" aria-busy="true">
      {Array.from({ length: 7 }, (_, index) => (
        <li className="skeleton-row" key={index} />
      ))}
    </ul>
  );
}

export function RegionColumn({
  title,
  levelLabel,
  placeholder,
  hint,
  status,
  regions,
  selectedCode,
  copiedCode,
  canSelectChildren,
  error,
  onSelect,
  onCopy,
  onRetry,
  mobileActive,
  mobileStepIndex,
}: RegionColumnProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase("id-ID"));
  const controlId = levelLabel.replaceAll(" ", "-").replaceAll("/", "-");
  const titleId = `column-${controlId}`;
  const listRef = useRef<HTMLUListElement>(null);

  const filteredRegions = useMemo(() => {
    if (!deferredQuery) return regions;
    return regions.filter(
      (region) =>
        region.name.toLocaleLowerCase("id-ID").includes(deferredQuery) ||
        region.code.includes(deferredQuery),
    );
  }, [deferredQuery, regions]);

  useEffect(() => {
    if (!mobileActive || mobileStepIndex === undefined) return;
    const activeButton = listRef.current?.querySelector<HTMLElement>(".region-select[aria-current='true']");
    activeButton?.scrollIntoView({ block: "nearest" });
  }, [mobileActive, mobileStepIndex, regions, selectedCode]);

  return (
    <section
      className={`region-column${mobileActive ? " is-mobile-active" : ""}${mobileActive === false ? " is-mobile-hidden" : ""}`}
      aria-labelledby={titleId}
    >
      <div className="column-header">
        <div className="column-title-row">
          <h2 id={titleId}>{title}</h2>
          {status === "success" ? (
            <span className="column-count" aria-label={`${regions.length} ${levelLabel}`}>
              {regions.length.toLocaleString("id-ID")}
            </span>
          ) : null}
        </div>
        <label className="sr-only" htmlFor={`search-${controlId}`}>
          Cari {levelLabel}
        </label>
        <div className="search-wrap">
          <MagnifyingGlass className="search-icon" size={18} aria-hidden="true" />
          <input
            id={`search-${controlId}`}
            className="search-input"
            type="search"
            name={`search-${controlId}`}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            disabled={status !== "success"}
            autoComplete="off"
            aria-describedby={status !== "success" ? `hint-${controlId}` : undefined}
          />
        </div>
        <p className="column-hint" id={`hint-${controlId}`}>
          {hint}
        </p>
      </div>

      {status === "loading" ? <SkeletonList /> : null}

      {status === "idle" ? (
        <div className="column-state">
          <MapPin size={34} weight="duotone" aria-hidden="true" />
          <p>{hint}</p>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="column-state is-error" role="alert">
          <WarningCircle size={34} weight="duotone" aria-hidden="true" />
          <p>{error}</p>
          <button className="retry-button" type="button" onClick={onRetry}>
            Coba lagi
          </button>
        </div>
      ) : null}

      {status === "success" && filteredRegions.length === 0 ? (
        <div className="column-state">
          <MagnifyingGlass size={34} aria-hidden="true" />
          <p>Tidak ada hasil untuk pencarian ini.</p>
        </div>
      ) : null}

      {status === "success" && filteredRegions.length > 0 ? (
        <ul className="region-list" ref={listRef}>
          {filteredRegions.map((region) => {
            const isSelected = selectedCode === region.code;
            const isCopied = copiedCode === region.code;
            return (
              <li className={`region-row${isSelected ? " is-selected" : ""}`} key={region.code}>
                <button
                  className="region-select"
                  type="button"
                  onClick={() => onSelect(region)}
                  aria-current={isSelected ? "true" : undefined}
                  aria-label={`Pilih ${region.name}, kode ${region.code}`}
                >
                  <span>
                    <span className="region-name">{region.name}</span>
                    <span className="region-code" translate="no">
                      {region.code}
                    </span>
                  </span>
                  {canSelectChildren ? (
                    <CaretRight className="row-caret" size={17} aria-hidden="true" />
                  ) : null}
                </button>
                <button
                  className="copy-button"
                  type="button"
                  onClick={() => onCopy(region)}
                  aria-label={isCopied ? `Kode ${region.code} tersalin` : `Salin kode ${region.code}`}
                  title={isCopied ? "Kode tersalin" : "Salin kode"}
                >
                  {isCopied ? (
                    <Check size={18} weight="bold" aria-hidden="true" />
                  ) : (
                    <CopySimple size={18} aria-hidden="true" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}
