"use client";

import { useState, useEffect } from "react";
import { DatasetId } from "@/lib/types";

interface UseChartDataParams {
  dataset: DatasetId;
  countries: string[];
  fuelType: string;
  make: string;
}

export function useChartData<T>({ dataset, countries, fuelType, make }: UseChartDataParams) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (countries.length === 0) {
      setData(null);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        let result: T;

        switch (dataset) {
          case 1: {
            const res = await fetch(
              `/api/registrations?country=${countries[0]}`,
              { signal: controller.signal }
            );
            const json = await res.json();
            result = json.data as T;
            break;
          }
          case 2: {
            const allData = await Promise.all(
              countries.map(async (c) => {
                const res = await fetch(
                  `/api/market-share?country=${c}&fuelType=${fuelType}&make=${encodeURIComponent(make)}`,
                  { signal: controller.signal }
                );
                const json = await res.json();
                return { country: c, data: json.data || [] };
              })
            );
            result = allData as T;
            break;
          }
          case 3: {
            const allData = await Promise.all(
              countries.map(async (c) => {
                const res = await fetch(
                  `/api/s-curve?country=${c}`,
                  { signal: controller.signal }
                );
                const json = await res.json();
                return { country: c, data: json.data || [] };
              })
            );
            result = allData as T;
            break;
          }
          case 4: {
            const [alltime, monthly] = await Promise.all([
              fetch(`/api/top-makes?country=${countries[0]}&type=alltime`, {
                signal: controller.signal,
              }).then((r) => r.json()),
              fetch(`/api/top-makes?country=${countries[0]}&type=monthly`, {
                signal: controller.signal,
              }).then((r) => r.json()),
            ]);
            result = { alltime: alltime.data, monthly: monthly.data } as T;
            break;
          }
          default:
            return;
        }

        setData(result);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
    return () => controller.abort();
  }, [dataset, countries, fuelType, make]);

  return { data, loading, error };
}
