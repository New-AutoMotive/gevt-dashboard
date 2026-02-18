import type { EChartsOption } from "echarts";

export function baseChartOption(overrides?: Partial<EChartsOption>): EChartsOption {
  return {
    grid: {
      left: 60,
      right: 20,
      top: 50,
      bottom: 50,
      containLabel: true,
    },
    tooltip: {
      trigger: "axis",
      confine: true,
      textStyle: { fontFamily: "Poppins", fontSize: 12 },
      valueFormatter: (value: unknown) =>
        typeof value === "number" ? value.toFixed(1) : String(value ?? ""),
    },
    legend: {
      type: "scroll",
      right: 0,
      top: 0,
      textStyle: { fontFamily: "Quicksand", fontSize: 13 },
    },
    xAxis: {
      type: "time",
      axisLabel: { fontFamily: "Quicksand", fontSize: 13 },
      axisLine: { lineStyle: { color: "#000", width: 2 } },
      splitLine: { show: false },
    },
    yAxis: {
      type: "value",
      axisLabel: { fontFamily: "Quicksand", fontSize: 13 },
      axisLine: { show: true, lineStyle: { color: "#000", width: 2 } },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(47, 45, 46, 0.8)", width: 0.6 },
      },
    },
    backgroundColor: "transparent",
    ...overrides,
  };
}

export function percentYAxis(): Partial<EChartsOption> {
  return {
    yAxis: {
      type: "value" as const,
      max: 100,
      axisLabel: {
        fontFamily: "Quicksand",
        fontSize: 13,
        formatter: "{value}%",
      },
      axisLine: { show: true, lineStyle: { color: "#000", width: 2 } },
      splitLine: {
        show: true,
        lineStyle: { color: "rgba(47, 45, 46, 0.8)", width: 0.6 },
      },
    },
  };
}
