"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { TopMakesRow } from "@/lib/types";
import { rollingSum } from "@/lib/transforms";
import { baseChartOption } from "@/lib/chart-options";

interface Props {
  alltime: TopMakesRow[];
  monthly: TopMakesRow[];
  rollingWindow: number;
}

export default function TopMakesChart({ alltime, monthly, rollingWindow }: Props) {
  const option = useMemo(() => {
    // Merge: filter monthly to only include makes NOT in alltime
    const alltimeMakes = new Set(alltime.map((r) => r.make));
    const filteredMonthly = monthly.filter((r) => !alltimeMakes.has(r.make));
    const combined = [...alltime, ...filteredMonthly];

    // Group by make
    const makeGroups: Record<string, { date: string; registrations: number; width: string }[]> = {};
    for (const row of combined) {
      if (!makeGroups[row.make]) makeGroups[row.make] = [];
      makeGroups[row.make].push({
        date: row.date,
        registrations: row.registrations,
        width: row.width,
      });
    }

    // Aggregate by date+make, then rolling sum
    const allMakes = Object.keys(makeGroups);
    const series = allMakes.map((make) => {
      const rows = makeGroups[make];
      const isThick = rows.some((r) => r.width === "thick");

      // Aggregate by date
      const byDate: Record<string, number> = {};
      for (const r of rows) {
        byDate[r.date] = (byDate[r.date] || 0) + r.registrations;
      }

      const tsData = Object.entries(byDate)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, value]) => ({ date, category: make, value }));

      const smoothed = rollingSum(tsData, rollingWindow);

      return {
        name: make,
        type: "line" as const,
        showSymbol: false,
        lineStyle: { width: isThick ? 3 : 1 },
        data: smoothed.map((d) => [d.date, d.value]),
      };
    });

    return {
      ...baseChartOption(),
      yAxis: {
        type: "value" as const,
        axisLabel: { fontFamily: "Quicksand", fontSize: 13 },
        axisLine: { show: true, lineStyle: { color: "#000", width: 2 } },
        splitLine: {
          show: true,
          lineStyle: { color: "rgba(47, 45, 46, 0.8)", width: 0.6 },
        },
      },
      series,
    };
  }, [alltime, monthly, rollingWindow]);

  return (
    <ReactECharts
      option={option}
      style={{ height: 600 }}
      notMerge
    />
  );
}
