"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const FUEL_TYPES = ["Petrol", "Diesel", "BEV", "HEV", "PHEV", "FHEV", "ICE"];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function FuelTypeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-dark-blue font-poppins text-sm font-medium">
        Fuel Type
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-light-blue rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FUEL_TYPES.map((ft) => (
            <SelectItem key={ft} value={ft}>
              {ft}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
