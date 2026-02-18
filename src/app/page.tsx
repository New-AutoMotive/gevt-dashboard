"use client";

import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import DatasetSelector from "@/components/controls/DatasetSelector";
import CountrySelector from "@/components/controls/CountrySelector";
import RollingWindowSelector from "@/components/controls/RollingWindowSelector";
import MarketShareToggle from "@/components/controls/MarketShareToggle";
import FuelTypeSelector from "@/components/controls/FuelTypeSelector";
import MakeSelector from "@/components/controls/MakeSelector";
import BacktestingSelector from "@/components/controls/BacktestingSelector";
import ChartContainer from "@/components/charts/ChartContainer";
import AreaChart from "@/components/charts/AreaChart";
import MarketShareChart from "@/components/charts/MarketShareChart";
import SCurveChart from "@/components/charts/SCurveChart";
import TopMakesChart from "@/components/charts/TopMakesChart";
import DownloadButton from "@/components/DownloadButton";

import { useDataset } from "@/hooks/useDataset";
import { useCountries } from "@/hooks/useCountries";
import { useChartData } from "@/hooks/useChartData";
import { useDownloadCSV } from "@/hooks/useDownloadCSV";

import { RegistrationRow, MktShareRow, SCurveRow, TopMakesRow } from "@/lib/types";

interface MktShareCountryData {
  country: string;
  data: MktShareRow[];
}

interface SCurveCountryData {
  country: string;
  data: SCurveRow[];
}

interface TopMakesData {
  alltime: TopMakesRow[];
  monthly: TopMakesRow[];
}

type ChartData = RegistrationRow[] | MktShareCountryData[] | SCurveCountryData[] | TopMakesData;

function flattenForCSV(data: ChartData): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as unknown as Record<string, unknown>[];
  // TopMakesData — merge alltime + monthly
  return [...data.alltime, ...data.monthly] as unknown as Record<string, unknown>[];
}

export default function Dashboard() {
  const ds = useDataset();
  const { countries, loading: countriesLoading } = useCountries(
    ds.config.requiresMakes
  );

  const { data, loading, error } = useChartData<ChartData>({
    dataset: ds.activeDataset,
    countries: ds.selectedCountries,
    fuelType: ds.fuelType,
    make: ds.make,
  });

  const { download } = useDownloadCSV();
  const hasData = data !== null && ds.selectedCountries.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <div className="flex flex-1 flex-col gap-4 p-4 md:flex-row">
        <Sidebar>
          <div className="shadow-card space-y-4 rounded-lg bg-white p-4">
            <DatasetSelector
              value={ds.activeDataset}
              onChange={ds.changeDataset}
            />
            <CountrySelector
              countries={countries}
              selected={ds.selectedCountries}
              multiSelect={ds.config.multiCountry}
              onChange={ds.setSelectedCountries}
            />
            <RollingWindowSelector
              value={ds.rollingWindow}
              onChange={ds.setRollingWindow}
            />

            {ds.activeDataset === 1 && (
              <MarketShareToggle
                checked={ds.marketShareMode}
                onChange={ds.setMarketShareMode}
              />
            )}

            {ds.activeDataset === 2 && (
              <>
                <FuelTypeSelector
                  value={ds.fuelType}
                  onChange={ds.setFuelType}
                />
                <MakeSelector value={ds.make} onChange={ds.setMake} />
              </>
            )}

            {ds.activeDataset === 3 && (
              <BacktestingSelector
                value={ds.backtestingMonths}
                onChange={ds.setBacktestingMonths}
              />
            )}
          </div>
        </Sidebar>

        <main className="flex-1">
          <ChartContainer
            loading={loading || countriesLoading}
            error={error}
            empty={!hasData}
          >
            {ds.activeDataset === 1 && data && (
              <AreaChart
                data={data as RegistrationRow[]}
                rollingWindow={ds.rollingWindow}
                displayPercentage={ds.marketShareMode}
              />
            )}

            {ds.activeDataset === 2 && data && (
              <MarketShareChart
                countriesData={data as MktShareCountryData[]}
                rollingWindow={ds.rollingWindow}
              />
            )}

            {ds.activeDataset === 3 && data && (
              <SCurveChart
                countriesData={data as SCurveCountryData[]}
                rollingWindow={ds.rollingWindow}
                backtestingMonths={ds.backtestingMonths}
              />
            )}

            {ds.activeDataset === 4 && data && (
              <TopMakesChart
                alltime={(data as TopMakesData).alltime}
                monthly={(data as TopMakesData).monthly}
                rollingWindow={ds.rollingWindow}
              />
            )}
          </ChartContainer>

          <div className="mt-2 flex justify-end">
            <DownloadButton
              visible={hasData}
              onClick={() => download(flattenForCSV(data!), "gevt_data")}
            />
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
}
