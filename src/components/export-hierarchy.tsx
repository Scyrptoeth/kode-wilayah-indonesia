"use client";

import { useCallback, useRef, useState } from "react";
import { DownloadSimple } from "@phosphor-icons/react";
import {
  downloadText,
  hierarchyToCsv,
  hierarchyToJson,
  type HierarchyPath,
} from "@/lib/regions";

interface ExportHierarchyProps {
  path: HierarchyPath;
  disabled?: boolean;
}

type ExportFormat = "json" | "csv";

export function ExportHierarchy({ path, disabled }: ExportHierarchyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const hasSelection = Boolean(path.province);

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
        <ul className="export-menu" role="menu" aria-label="Format ekspor">
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
