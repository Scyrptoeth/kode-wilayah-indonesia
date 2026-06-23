"use client";

import { MapTrifold } from "@phosphor-icons/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

export function RegionExplorer({ initialSelection }: { initialSelection: InitialSelection }) {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [copiedCode, setCopiedCode] = useState<string>();
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const provinces = useRegions("provinces", undefined, true);
  const regencies = useRegions("regencies", selection.province, Boolean(selection.province));
  const districts = useRegions("districts", selection.regency, Boolean(selection.regency));
  const villages = useRegions("villages", selection.district, Boolean(selection.district));

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
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedCode(undefined), 1_600);
    } catch {
      setCopiedCode(undefined);
    }
  }, []);

  return (
    <section className="explorer-shell" aria-label="Penjelajah kode wilayah Indonesia">
      <div className="explorer-toolbar">
        <div className="selection-path" aria-live="polite">
          <MapTrifold size={20} weight="duotone" aria-hidden="true" />
          <strong>{names.length > 0 ? names.join(" / ") : "Pilih provinsi untuk mulai"}</strong>
        </div>
        <button
          className="reset-button"
          type="button"
          onClick={() => setSelection({})}
          disabled={!selection.province}
        >
          Atur ulang
        </button>
      </div>

      <div className="explorer-grid">
        <RegionColumn
          title="Provinsi"
          levelLabel="provinsi"
          placeholder="Cari provinsi…"
          hint="Pilih provinsi untuk melihat kabupaten atau kota."
          status={provinces.status}
          regions={provinces.regions}
          selectedCode={selection.province}
          copiedCode={copiedCode}
          canSelectChildren
          error={provinces.error}
          onRetry={provinces.retry}
          onCopy={copyRegionCode}
          onSelect={(region) => setSelection({ province: region.code })}
        />
        <RegionColumn
          key={`regencies-${selection.province ?? "empty"}`}
          title="Kabupaten / Kota"
          levelLabel="kabupaten atau kota"
          placeholder="Cari kabupaten atau kota…"
          hint={selection.province ? "Pilih kabupaten atau kota." : "Pilih provinsi dahulu."}
          status={regencies.status}
          regions={regencies.regions}
          selectedCode={selection.regency}
          copiedCode={copiedCode}
          canSelectChildren
          error={regencies.error}
          onRetry={regencies.retry}
          onCopy={copyRegionCode}
          onSelect={(region) =>
            setSelection((current) => ({ province: current.province, regency: region.code }))
          }
        />
        <RegionColumn
          key={`districts-${selection.regency ?? "empty"}`}
          title="Kecamatan"
          levelLabel="kecamatan"
          placeholder="Cari kecamatan…"
          hint={selection.regency ? "Pilih kecamatan." : "Pilih kabupaten atau kota dahulu."}
          status={districts.status}
          regions={districts.regions}
          selectedCode={selection.district}
          copiedCode={copiedCode}
          canSelectChildren
          error={districts.error}
          onRetry={districts.retry}
          onCopy={copyRegionCode}
          onSelect={(region) =>
            setSelection((current) => ({
              province: current.province,
              regency: current.regency,
              district: region.code,
            }))
          }
        />
        <RegionColumn
          key={`villages-${selection.district ?? "empty"}`}
          title="Desa / Kelurahan"
          levelLabel="desa atau kelurahan"
          placeholder="Cari desa atau kelurahan…"
          hint={selection.district ? "Pilih atau salin kode wilayah." : "Pilih kecamatan dahulu."}
          status={villages.status}
          regions={villages.regions}
          selectedCode={selection.village}
          copiedCode={copiedCode}
          canSelectChildren={false}
          error={villages.error}
          onRetry={villages.retry}
          onCopy={copyRegionCode}
          onSelect={(region) =>
            setSelection((current) => ({ ...current, village: region.code }))
          }
        />
      </div>
    </section>
  );
}
