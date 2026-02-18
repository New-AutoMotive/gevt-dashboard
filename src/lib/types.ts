export interface RegistrationRow {
  date: string;
  fuelType: string;
  registrations: number;
}

export interface MktShareRow {
  date: string;
  partial: number;
  total: number;
}

export interface SCurveRow {
  date: string;
  BEV: number;
  Total: number;
}

export interface TopMakesRow {
  date: string;
  country: string;
  fuelType: string;
  make: string;
  registrations: number;
  width: "thick" | "thin";
}

export type DatasetId = 1 | 2 | 3 | 4;

export interface DatasetConfig {
  id: DatasetId;
  label: string;
  multiCountry: boolean;
  requiresMakes: boolean;
}

export const DATASETS: Record<DatasetId, DatasetConfig> = {
  1: {
    id: 1,
    label: "Monthly New Registrations",
    multiCountry: false,
    requiresMakes: false,
  },
  2: {
    id: 2,
    label: "Manufacturers - Comparison",
    multiCountry: true,
    requiresMakes: true,
  },
  3: {
    id: 3,
    label: "S-Curve Like Adoption",
    multiCountry: true,
    requiresMakes: false,
  },
  4: {
    id: 4,
    label: "Top BEV Manufacturers",
    multiCountry: false,
    requiresMakes: true,
  },
};

export type FuelType =
  | "Petrol"
  | "Diesel"
  | "BEV"
  | "HEV"
  | "PHEV"
  | "FHEV"
  | "ICE"
  | "HEV/ BEV"
  | "Other";

export const FUEL_TYPE_COLORS: Record<string, string> = {
  "HEV/ BEV": "#C1755E",
  BEV: "#4FAC31",
  HEV: "#6A7FA6",
  PHEV: "#50B1D4",
  FHEV: "#737373",
  ICE: "#13213F",
  Diesel: "#000000",
  Petrol: "#1F3260",
  Other: "#3070E8",
};

export const FUEL_TYPE_ORDER = [
  "HEV/ BEV",
  "BEV",
  "HEV",
  "PHEV",
  "FHEV",
  "ICE",
  "Diesel",
  "Petrol",
  "Other",
];
