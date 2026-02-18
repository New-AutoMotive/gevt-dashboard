"use client";

import { useState, useCallback } from "react";
import { DatasetId, DATASETS } from "@/lib/types";

export function useDataset() {
  const [activeDataset, setActiveDataset] = useState<DatasetId>(1);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [rollingWindow, setRollingWindow] = useState(3);
  const [fuelType, setFuelType] = useState("BEV");
  const [make, setMake] = useState("Tesla");
  const [marketShareMode, setMarketShareMode] = useState(true);
  const [backtestingMonths, setBacktestingMonths] = useState<number[]>([0]);

  const config = DATASETS[activeDataset];

  const changeDataset = useCallback(
    (id: DatasetId) => {
      setActiveDataset(id);
      setSelectedCountries([]);
    },
    []
  );

  return {
    activeDataset,
    config,
    selectedCountries,
    rollingWindow,
    fuelType,
    make,
    marketShareMode,
    backtestingMonths,
    changeDataset,
    setSelectedCountries,
    setRollingWindow,
    setFuelType,
    setMake,
    setMarketShareMode,
    setBacktestingMonths,
  };
}
