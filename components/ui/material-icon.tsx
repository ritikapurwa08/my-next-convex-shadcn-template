import { cn } from "@/lib/utils";

interface MaterialIconProps {
  name: string; // The exact name of the Google Material Symbol (e.g., "dashboard")
  className?: string; // Optional Tailwind classes for size, color, or margins
}

export function MaterialIcon({ name, className }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined", className)}
      data-icon={name}
    >
      {name}
    </span>
  );
}
