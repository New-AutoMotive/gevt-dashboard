import { RegistrationRow } from "./types";

interface TimeSeriesRow {
  date: string;
  category: string;
  value: number;
}

export function rollingMean(
  data: TimeSeriesRow[],
  windowSize: number
): TimeSeriesRow[] {
  const grouped = groupBy(data, "category");
  return Object.entries(grouped).flatMap(([, rows]) => {
    const sorted = rows.sort((a, b) => a.date.localeCompare(b.date));
    return sorted
      .map((row, i) => {
        if (i < windowSize - 1) return null;
        const window = sorted.slice(i - windowSize + 1, i + 1);
        const mean = window.reduce((sum, r) => sum + r.value, 0) / windowSize;
        return { ...row, value: mean };
      })
      .filter((r): r is TimeSeriesRow => r !== null);
  });
}

export function rollingSum(
  data: TimeSeriesRow[],
  windowSize: number
): TimeSeriesRow[] {
  const grouped = groupBy(data, "category");
  return Object.entries(grouped).flatMap(([, rows]) => {
    const sorted = rows.sort((a, b) => a.date.localeCompare(b.date));
    return sorted
      .map((row, i) => {
        if (i < windowSize - 1) return null;
        const window = sorted.slice(i - windowSize + 1, i + 1);
        const sum = window.reduce((s, r) => s + r.value, 0);
        return { ...row, value: sum };
      })
      .filter((r): r is TimeSeriesRow => r !== null);
  });
}

export function computeMarketShare(
  data: RegistrationRow[],
  rollingWindow: number
): { date: string; fuelType: string; registrations: number; mktShare: number }[] {
  // Pivot by fuelType, rolling mean, then compute share
  const fuelTypes = [...new Set(data.map((d) => d.fuelType))];
  const dates = [...new Set(data.map((d) => d.date))].sort();

  // Build matrix: date -> fuelType -> value
  const matrix: Record<string, Record<string, number>> = {};
  for (const row of data) {
    if (!matrix[row.date]) matrix[row.date] = {};
    matrix[row.date][row.fuelType] =
      (matrix[row.date][row.fuelType] || 0) + row.registrations;
  }

  // Apply rolling mean per fuel type
  const smoothed: TimeSeriesRow[] = [];
  for (const ft of fuelTypes) {
    const series = dates.map((d) => ({
      date: d,
      category: ft,
      value: matrix[d]?.[ft] || 0,
    }));
    smoothed.push(...rollingMean(series, rollingWindow));
  }

  // Compute totals per date
  const totals: Record<string, number> = {};
  for (const row of smoothed) {
    totals[row.date] = (totals[row.date] || 0) + row.value;
  }

  return smoothed.map((row) => ({
    date: row.date,
    fuelType: row.category,
    registrations: row.value,
    mktShare: totals[row.date] > 0 ? (row.value / totals[row.date]) * 100 : 0,
  }));
}

export function toProperCase(fuelType: string): string {
  const keep = ["BEV", "PHEV", "FHEV", "HEV", "ICE", "HEV/BEV", "HEV/ BEV"];
  if (keep.includes(fuelType.toUpperCase()) || keep.includes(fuelType)) {
    return fuelType;
  }
  return fuelType.charAt(0).toUpperCase() + fuelType.slice(1).toLowerCase();
}

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const k = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    },
    {} as Record<string, T[]>
  );
}
