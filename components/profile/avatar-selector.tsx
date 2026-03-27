"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MaterialIcon } from "@/components/ui/material-icon";
import { cn } from "@/lib/utils";

type AvatarPickerProps = {
  images: StaticImageData[];
  value?: StaticImageData;
  onChange: (value: StaticImageData) => void;
};

// ── Named export (used in sign-up page) ───────────────────────────────────
export function AvatarPickerDialog({ images, value, onChange }: AvatarPickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (img: StaticImageData) => {
    onChange(img);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group flex flex-col items-center gap-2 focus:outline-none"
          aria-label="Select avatar"
        >
          {/* Avatar circle */}
          <div className="relative">
            <div className={cn(
              "w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all",
              value
                ? "border-primary shadow-lg shadow-primary/20"
                : "border-dashed border-outline-variant bg-surface-container"
            )}>
              {value ? (
                <Image src={value} alt="Selected avatar" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <MaterialIcon name="add_a_photo" className="text-2xl text-outline" />
              )}
            </div>
            {/* Edit badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
              <MaterialIcon name="edit" className="text-white text-xs" />
            </div>
          </div>
          <span className="text-xs font-semibold text-secondary group-hover:text-primary transition-colors">
            {value ? "Change Avatar" : "Select Avatar"}
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl bg-surface-container-lowest rounded-3xl border border-outline-variant/20 p-6">
        <DialogTitle className="font-headline font-bold text-on-surface text-lg mb-4">
          Choose Your Avatar
        </DialogTitle>

        <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 max-h-[420px] overflow-y-auto pr-1">
          {images.map((img, index) => {
            const isSelected = value?.src === img.src;
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(img)}
                className={cn(
                  "relative rounded-xl overflow-hidden aspect-square transition-all focus:outline-none",
                  isSelected
                    ? "ring-2 ring-primary ring-offset-2 scale-105 shadow-md shadow-primary/20"
                    : "hover:scale-105 hover:ring-2 hover:ring-outline-variant"
                )}
                aria-label={`Avatar option ${index + 1}`}
                aria-pressed={isSelected}
              >
                <Image
                  src={img}
                  alt={`Avatar ${index + 1}`}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <MaterialIcon name="check_circle" className="text-white text-xl" style={{ fontVariationSettings: "'FILL' 1" }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Default export (backward-compat for any legacy imports) ───────────────
export default AvatarPickerDialog;
