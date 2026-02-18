"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function MarketShareToggle({ checked, onChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <Label className="font-poppins text-sm">Market Share (%)</Label>
    </div>
  );
}
