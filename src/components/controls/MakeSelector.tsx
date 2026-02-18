"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { MAKE_OPTIONS } from "@/lib/makes";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function MakeSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-dark-blue font-poppins text-sm font-medium">
        Manufacturer
      </Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-light-blue rounded-lg">
          <SelectValue placeholder="Select manufacturer" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {MAKE_OPTIONS.map((make) => (
            <SelectItem key={make} value={make}>
              {make}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
