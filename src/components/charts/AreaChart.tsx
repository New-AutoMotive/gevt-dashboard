"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { RegistrationRow, FUEL_TYPE_COLORS, FUEL_TYPE_ORDER } from "@/lib/types";
import { computeMarketShare, toProperCase } from "@/lib/transforms";
import { baseChartOption, percentYAxis } from "@/lib/chart-options";

interface Props {
  data: RegistrationRow[];
  rollingWindow: number;
  displayPercentage: boolean;
}

export default function AreaChart({ data, rollingWindow, displayPercentage }: Props) {
  const option = useMemo(() => {
    const transformed = computeMarketShare(data, rollingWindow);

    // Normalize fuel type names
    const rows = transformed.map((r) => ({
      ...r,
      fuelType: toProperCase(r.fuelType),
    }));

    // Get fuel types in correct order
    const fuelTypes = FUEL_TYPE_ORDER.filter((ft) =>
      rows.some((r) => r.fuelType === ft)
    );

    const series = fuelTypes.map((ft) => {
      const ftData = rows
        .filter((r) => r.fuelType === ft)
        .sort((a, b) => a.date.localeCompare(b.date));

      return {
        name: ft,
        type: "line" as const,
        stack: "total",
        areaStyle: {},
        showSymbol: false,
        itemStyle: { color: FUEL_TYPE_COLORS[ft] || "#999" },
        data: ftData.map((d) => [
          d.date,
          displayPercentage ? d.mktShare : d.registrations,
        ]),
      };
    });

    return {
      ...baseChartOption(),
      ...(displayPercentage ? percentYAxis() : {}),
      series,
    };
  }, [data, rollingWindow, displayPercentage]);

  return (
    <ReactECharts
      option={option}
      style={{ height: 600 }}
      notMerge
    />
  );
}
