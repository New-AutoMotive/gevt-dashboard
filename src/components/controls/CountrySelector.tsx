"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { getCountryLabel } from "@/lib/countries";

interface Props {
  countries: string[];
  selected: string[];
  multiSelect: boolean;
  onChange: (selected: string[]) => void;
}

export default function CountrySelector({
  countries,
  selected,
  multiSelect,
  onChange,
}: Props) {
  const toggle = (code: string) => {
    if (multiSelect) {
      if (selected.includes(code)) {
        onChange(selected.filter((c) => c !== code));
      } else {
        onChange([...selected, code]);
      }
    } else {
      onChange([code]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-dark-blue font-poppins text-sm font-medium">
        Countries
      </Label>
      <div className="shadow-card max-h-[200px] overflow-y-auto rounded-lg bg-white p-2">
        {countries.map((code) => (
          <div
            key={code}
            className="flex items-center justify-between px-2 py-1"
          >
            <span className="font-poppins text-sm">{getCountryLabel(code)}</span>
            <Switch
              checked={selected.includes(code)}
              onCheckedChange={() => toggle(code)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
