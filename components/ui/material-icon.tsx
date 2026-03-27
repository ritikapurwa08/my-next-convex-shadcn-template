import { cn } from "@/lib/utils";
import React from "react";

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialIcon({ name, className, style }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      data-icon={name}
      style={style}
    >
      {name}
    </span>
  );
}
