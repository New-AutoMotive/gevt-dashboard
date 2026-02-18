"use client";

import { DATASETS, DatasetId } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Props {
  value: DatasetId;
  onChange: (id: DatasetId) => void;
}

export default function DatasetSelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-dark-blue font-poppins text-sm font-medium">
        Dataset
      </Label>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(Number(v) as DatasetId)}
      >
        <SelectTrigger className="bg-light-blue rounded-lg">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(DATASETS).map((ds) => (
            <SelectItem key={ds.id} value={String(ds.id)}>
              {ds.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
