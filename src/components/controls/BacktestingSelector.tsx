"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  value: number[];
  onChange: (value: number[]) => void;
}

const MONTHS = Array.from({ length: 37 }, (_, i) => i);

export default function BacktestingSelector({ value, onChange }: Props) {
  const toggle = (month: number) => {
    if (value.includes(month)) {
      onChange(value.filter((m) => m !== month));
    } else {
      onChange([...value, month]);
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-dark-blue font-poppins text-sm font-medium">
        Backtesting (months back)
      </Label>
      <Select
        value={value.length > 0 ? value.join(",") : "0"}
        onValueChange={() => {}}
      >
        <SelectTrigger className="bg-light-blue rounded-lg">
          <SelectValue>
            {value.length === 0
              ? "Current"
              : `${value.length} selected`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {MONTHS.map((m) => (
            <SelectItem
              key={m}
              value={String(m)}
              onClick={() => toggle(m)}
              className={value.includes(m) ? "bg-light-blue" : ""}
            >
              {m === 0 ? "Current" : `${m} month${m > 1 ? "s" : ""} back`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
