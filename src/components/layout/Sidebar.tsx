"use client";

import { ReactNode } from "react";

interface SidebarProps {
  children: ReactNode;
}

export default function Sidebar({ children }: SidebarProps) {
  return (
    <aside className="flex w-full flex-col gap-4 md:w-[300px] md:min-w-[300px]">
      {children}
    </aside>
  );
}
