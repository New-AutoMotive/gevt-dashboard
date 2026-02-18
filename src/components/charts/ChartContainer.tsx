"use client";

import { ReactNode } from "react";

interface Props {
  loading: boolean;
  error: string | null;
  empty: boolean;
  children: ReactNode;
}

export default function ChartContainer({ loading, error, empty, children }: Props) {
  if (loading) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-button-blue" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="font-poppins text-red-500">{error}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex h-[600px] items-center justify-center">
        <p className="font-poppins text-lg text-gray-400">
          Use the control panel on the left to explore the selected dataset.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
