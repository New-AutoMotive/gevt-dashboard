"use client";

import { Button } from "@/components/ui/button";

interface Props {
  onClick: () => void;
  visible: boolean;
}

export default function DownloadButton({ onClick, visible }: Props) {
  if (!visible) return null;

  return (
    <Button
      onClick={onClick}
      className="bg-button-blue font-poppins text-white hover:bg-blue-600"
    >
      Download CSV
    </Button>
  );
}
