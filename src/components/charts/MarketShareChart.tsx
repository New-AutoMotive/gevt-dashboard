"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { MktShareRow } from "@/lib/types";
import { getCountryLabel } from "@/lib/countries";
import { baseChartOption, percentYAxis } from "@/lib/chart-options";

interface CountryData {
  country: string;
  data: MktShareRow[];
}

interface Props {
  countriesData: CountryData[];
  rollingWindow: number;
}

export default function MarketShareChart({ countriesData, rollingWindow }: Props) {
  const option = useMemo(() => {
    const series = countriesData.map(({ country, data }) => {
      // Sort by date
      const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));

      // Compute market share + rolling mean
      const mktShare = sorted.map((r) =>
        r.total > 0 ? (r.partial / r.total) * 100 : 0
      );

      // Rolling mean
      const smoothed: [string, number][] = [];
      for (let i = rollingWindow - 1; i < sorted.length; i++) {
        let sum = 0;
        for (let j = i - rollingWindow + 1; j <= i; j++) {
          sum += mktShare[j];
        }
        smoothed.push([sorted[i].date, sum / rollingWindow]);
      }

      return {
        name: getCountryLabel(country),
        type: "line" as const,
        showSymbol: false,
        data: smoothed,
      };
    });

    return {
      ...baseChartOption(),
      ...percentYAxis(),
      series,
    };
  }, [countriesData, rollingWindow]);

  return (
    <ReactECharts
      option={option}
      style={{ height: 600 }}
      notMerge
    />
  );
}
