"use client";

import { DownloadSimple } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  downloadText,
  hierarchyToCsv,
  hierarchyToJson,
  type HierarchyPath,
} from "@/lib/export";

interface ExportHierarchyProps {
  path: HierarchyPath;
  disabled?: boolean;
}

type ExportFormat = "json" | "csv";

export function ExportHierarchy({ path, disabled }: ExportHierarchyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const hasSelection = Boolean(path.province);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    }

    function handleClickOutside(event: MouseEvent) {
      if (!(event.target instanceof Node)) return;
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = useCallback(
    (format: ExportFormat) => {
      if (!hasSelection) return;

      const timestamp = new Date().toISOString().slice(0, 10);
      if (format === "json") {
        const content = hierarchyToJson(path);
        downloadText(`wilayah-${timestamp}.json`, content);
      } else {
        const content = hierarchyToCsv(path);
        downloadText(`wilayah-${timestamp}.csv`, content);
      }
      setIsOpen(false);
    },
    [hasSelection, path],
  );

  return (
    <div className="export-hierarchy" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className="export-button"
        onClick={() => setIsOpen((current) => !current)}
        disabled={disabled || !hasSelection}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Ekspor hierarki wilayah"
        title="Ekspor hierarki"
      >
        <DownloadSimple size={18} weight="bold" aria-hidden="true" />
        <span>Ekspor</span>
      </button>

      {isOpen ? (
        <ul ref={menuRef} className="export-menu" role="menu" aria-label="Format ekspor">
          <li role="none">
            <button
              type="button"
              className="export-menu-item"
              role="menuitem"
              onClick={() => handleExport("json")}
            >
              <strong>JSON</strong>
              <span>Salin struktur lengkap</span>
            </button>
          </li>
          <li role="none">
            <button
              type="button"
              className="export-menu-item"
              role="menuitem"
              onClick={() => handleExport("csv")}
            >
              <strong>CSV</strong>
              <span>Unduh sebagai spreadsheet</span>
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  );
}
