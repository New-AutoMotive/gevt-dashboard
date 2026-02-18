"use client";

import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import { SCurveRow } from "@/lib/types";
import { fitAndProject } from "@/lib/s-curve";
import { getCountryLabel } from "@/lib/countries";
import { generateColors } from "@/lib/colors";
import { baseChartOption, percentYAxis } from "@/lib/chart-options";
import type { EChartsOption } from "echarts";

interface CountryData {
  country: string;
  data: SCurveRow[];
}

interface Props {
  countriesData: CountryData[];
  rollingWindow: number;
  backtestingMonths: number[];
}

export default function SCurveChart({
  countriesData,
  rollingWindow,
  backtestingMonths,
}: Props) {
  const option = useMemo(() => {
    const allCountries = countriesData.map((c) => c.country);
    const colorMap = generateColors(allCountries);
    const series: EChartsOption["series"] = [];

    for (const { country, data } of countriesData) {
      if (data.length === 0) continue;

      const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
      const months = backtestingMonths.length > 0 ? backtestingMonths : [0];

      for (const bt of months) {
        const sliced = bt > 0 ? sorted.slice(0, -bt) : sorted;
        if (sliced.length < rollingWindow + 2) continue;

        const bevValues = sliced.map((r) => r.BEV);
        const totalValues = sliced.map((r) => r.Total);
        const startDate = sliced[0].date;

        try {
          const result = fitAndProject(bevValues, totalValues, startDate, rollingWindow);
          const color = colorMap[country];
          const label = bt > 0
            ? `${getCountryLabel(country)} - ${bt}m back`
            : getCountryLabel(country);
          const width = bt > 0 ? 0.6 : 1.4;

          // Data points (scatter)
          series.push({
            name: label,
            type: "scatter",
            symbolSize: 6,
            itemStyle: {
              color: "#fff",
              borderColor: color,
              borderWidth: width,
            },
            data: result.historicalDates.map((d, i) => [d, result.fittedY[i] !== undefined ? result.fittedY[i] : null]),
            // Use actual y values for scatter
          });

          // Override scatter data with actual y values from fitting input
          const yActual: number[] = [];
          for (let i = rollingWindow - 1; i < sliced.length; i++) {
            let bevSum = 0, totalSum = 0;
            for (let j = i - rollingWindow + 1; j <= i; j++) {
              bevSum += bevValues[j];
              totalSum += totalValues[j];
            }
            yActual.push(totalSum > 0 ? (bevSum / totalSum) * 100 : 0);
          }
          // Replace scatter data with actual values
          (series[series.length - 1] as { data: [string, number][] }).data =
            result.historicalDates.map((d, i) => [d, yActual[i]]);

          // Fit line (solid)
          series.push({
            name: `${label} fit`,
            type: "line",
            showSymbol: false,
            lineStyle: { color, width },
            itemStyle: { color },
            data: result.historicalDates.map((d, i) => [d, result.fittedY[i]]),
            legendHoverLink: false,
          });

          // Projection (dashed)
          series.push({
            name: `${label} proj`,
            type: "line",
            showSymbol: false,
            lineStyle: { color, type: "dashed", width: 3 },
            itemStyle: { color },
            data: result.futureDates.map((d, i) => [d, result.projectedY[i]]),
            legendHoverLink: false,
          });
        } catch {
          // curve fitting failed for this country/backtesting combo
        }
      }
    }

    return {
      ...baseChartOption(),
      ...percentYAxis(),
      series,
    };
  }, [countriesData, rollingWindow, backtestingMonths]);

  return (
    <ReactECharts
      option={option}
      style={{ height: 600 }}
      notMerge
    />
  );
}
