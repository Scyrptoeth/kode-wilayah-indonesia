"use client";

import { MapTrifold } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GlobalSearch, type GlobalSearchSelection } from "@/components/global-search";
import { RegionColumn, type ColumnStatus } from "@/components/region-column";
import type {
  InitialSelection,
  Region,
  RegionLevel,
  RegionResponse,
} from "@/lib/regions";

interface LoadState {
  status: ColumnStatus;
  regions: Region[];
  error?: string;
}

interface Selection {
  province?: string;
  regency?: string;
  district?: string;
  village?: string;
}

interface Step {
  key: keyof Selection;
  title: string;
  level: RegionLevel;
  levelLabel: string;
  placeholder: string;
}

const STEPS: Step[] = [
  {
    key: "province",
    title: "Provinsi",
    level: "provinces",
    levelLabel: "provinsi",
    placeholder: "Cari provinsi…",
  },
  {
    key: "regency",
    title: "Kabupaten / Kota",
    level: "regencies",
    levelLabel: "kabupaten atau kota",
    placeholder: "Cari kabupaten atau kota…",
  },
  {
    key: "district",
    title: "Kecamatan",
    level: "districts",
    levelLabel: "kecamatan",
    placeholder: "Cari kecamatan…",
  },
  {
    key: "village",
    title: "Desa / Kelurahan",
    level: "villages",
    levelLabel: "desa atau kelurahan",
    placeholder: "Cari desa atau kelurahan…",
  },
];

const EMPTY_STATE: LoadState = { status: "idle", regions: [] };

class RegionRequestError extends Error {}

function useRegions(level: RegionLevel, parent: string | undefined, enabled: boolean) {
  const [attempt, setAttempt] = useState(0);
  const requestKey = enabled ? `${level}:${parent ?? "root"}:${attempt}` : "idle";
  const [state, setState] = useState<LoadState & { requestKey: string }>({
    status: "loading",
    regions: [],
    requestKey,
  });

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ level });
    if (parent) params.set("parent", parent);

    async function load() {
      try {
        const response = await fetch(`/api/regions?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as RegionResponse | { error?: string };
        if (!response.ok || !("data" in payload)) {
          throw new RegionRequestError(
            "error" in payload && payload.error
              ? payload.error
              : "Data wilayah gagal dimuat.",
          );
        }
        setState({ status: "success", regions: payload.data, requestKey });
      } catch (error) {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          regions: [],
          error:
            error instanceof RegionRequestError
              ? error.message
              : "Data wilayah gagal dimuat. Periksa koneksi lalu coba lagi.",
          requestKey,
        });
      }
    }

    void load();
    return () => controller.abort();
  }, [enabled, level, parent, requestKey]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const currentState: LoadState = !enabled
    ? EMPTY_STATE
    : state.requestKey === requestKey
      ? state
      : { status: "loading", regions: [] };
  return { ...currentState, retry };
}

function selectedName(regions: Region[], code: string | undefined) {
  return regions.find((region) => region.code === code)?.name;
}

function stepIndexForSelection(selection: Selection): number {
  if (!selection.province) return 0;
  if (!selection.regency) return 1;
  if (!selection.district) return 2;
  return 3;
}

export function RegionExplorer({ initialSelection }: { initialSelection: InitialSelection }) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [copiedCode, setCopiedCode] = useState<string>();
  const [copiedName, setCopiedName] = useState<string>();
  const [mobileStep, setMobileStep] = useState(() => stepIndexForSelection(initialSelection));
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const provinces = useRegions("provinces", undefined, true);
  const regencies = useRegions("regencies", selection.province, Boolean(selection.province));
  const districts = useRegions("districts", selection.regency, Boolean(selection.regency));
  const villages = useRegions("villages", selection.district, Boolean(selection.district));

  const levelData: Record<keyof Selection, LoadState> = {
    province: provinces,
    regency: regencies,
    district: districts,
    village: villages,
  };

  const levelRetries: Record<keyof Selection, () => void> = {
    province: provinces.retry,
    regency: regencies.retry,
    district: districts.retry,
    village: villages.retry,
  };

  const levelRegions: Record<keyof Selection, Region[]> = {
    province: provinces.regions,
    regency: regencies.regions,
    district: districts.regions,
    village: villages.regions,
  };

  const names = useMemo(
    () => [
      selectedName(provinces.regions, selection.province),
      selectedName(regencies.regions, selection.regency),
      selectedName(districts.regions, selection.district),
      selectedName(villages.regions, selection.village),
    ].filter(Boolean) as string[],
    [districts.regions, provinces.regions, regencies.regions, selection, villages.regions],
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (selection.province) params.set("province", selection.province);
    if (selection.regency) params.set("regency", selection.regency);
    if (selection.district) params.set("district", selection.district);
    if (selection.village) params.set("village", selection.village);
    const query = params.toString();
    window.history.replaceState(null, "", query ? `/?${query}` : "/");
  }, [selection]);

  useEffect(() => {
    return () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    };
  }, []);

  const copyRegionCode = useCallback(async (region: Region) => {
    try {
      await navigator.clipboard.writeText(region.code);
      setCopiedCode(region.code);
      setCopiedName(region.name);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => {
        setCopiedCode(undefined);
        setCopiedName(undefined);
      }, 1_600);
    } catch {
      setCopiedCode(undefined);
      setCopiedName(undefined);
    }
  }, []);

  function handleSelect(step: Step, region: Region) {
    setSelection((current) => {
      const next: Selection = { ...current };

      if (step.key === "province") {
        next.province = region.code;
        delete next.regency;
        delete next.district;
        delete next.village;
      } else if (step.key === "regency") {
        next.regency = region.code;
        delete next.district;
        delete next.village;
      } else if (step.key === "district") {
        next.district = region.code;
        delete next.village;
      } else {
        next.village = region.code;
      }

      return next;
    });

    const nextStepIndex = STEPS.findIndex((s) => s.key === step.key) + 1;
    if (nextStepIndex < STEPS.length) {
      setMobileStep(nextStepIndex);
    }
  }

  function handleReset() {
    setSelection({});
    setMobileStep(0);
  }

  function handleSearchSelect(next: GlobalSearchSelection) {
    setSelection(next);
    setMobileStep(stepIndexForSelection(next));
  }

  function stepStatus(stepIndex: number): "complete" | "active" | "pending" {
    const currentStep = stepIndexForSelection(selection);
    if (stepIndex < currentStep) return "complete";
    if (stepIndex === currentStep) return "active";
    return "pending";
  }

  return (
    <section className="explorer-shell" aria-label="Penjelajah kode wilayah Indonesia">
      <GlobalSearch onSelect={handleSearchSelect} />

      <div className="explorer-toolbar">
        <div className="selection-path" aria-live="polite">
          <MapTrifold size={20} weight="duotone" aria-hidden="true" />
          <strong>{names.length > 0 ? names.join(" / ") : "Pilih provinsi untuk mulai"}</strong>
        </div>
        <button
          className="reset-button"
          type="button"
          onClick={handleReset}
          disabled={!selection.province}
        >
          Atur ulang
        </button>
      </div>

      <div
        className="copy-feedback"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-visible={Boolean(copiedCode)}
      >
        {copiedCode ? `Kode ${copiedCode} — ${copiedName} tersalin` : ""}
      </div>

      <nav className="mobile-stepper" aria-label="Tahapan penjelajahan">
        <ol>
          {STEPS.map((step, index) => {
            const status = stepStatus(index);
            const isActive = index === mobileStep;
            return (
              <li key={step.key}>
                <button
                  type="button"
                  className={`mobile-step${isActive ? " is-active" : ""}${status === "complete" ? " is-complete" : ""}`}
                  onClick={() => setMobileStep(index)}
                  aria-current={isActive ? "step" : undefined}
                  aria-disabled={status === "pending"}
                  disabled={status === "pending"}
                >
                  <span className="mobile-step-number" aria-hidden="true">
                    {status === "complete" ? "✓" : index + 1}
                  </span>
                  <span className="mobile-step-label">{step.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="explorer-grid">
        {STEPS.map((step, index) => {
          const data = levelData[step.key];
          const parentKey = STEPS[index - 1]?.key;
          const parentSelected = parentKey ? Boolean(selection[parentKey]) : true;

          return (
            <RegionColumn
              key={`${step.key}-${selection[step.key] ?? "empty"}`}
              title={step.title}
              levelLabel={step.levelLabel}
              placeholder={step.placeholder}
              hint={
                !parentSelected
                  ? `Pilih ${STEPS[index - 1].levelLabel} dahulu.`
                  : step.key === "province"
                    ? "Pilih provinsi untuk melihat kabupaten atau kota."
                    : step.key === "village"
                      ? "Pilih atau salin kode wilayah."
                      : `Pilih ${step.levelLabel}.`
              }
              status={data.status}
              regions={levelRegions[step.key]}
              selectedCode={selection[step.key]}
              copiedCode={copiedCode}
              canSelectChildren={index < STEPS.length - 1}
              error={data.error}
              onRetry={levelRetries[step.key]}
              onCopy={copyRegionCode}
              onSelect={(region) => handleSelect(step, region)}
              mobileActive={index === mobileStep}
              mobileStepIndex={index}
              virtualize={step.key === "village"}
            />
          );
        })}
      </div>
    </section>
  );
}
