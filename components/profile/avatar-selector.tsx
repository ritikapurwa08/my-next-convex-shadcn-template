"use client";

import * as React from "react";
import Image, { StaticImageData } from "next/image";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type AvatarPickerProps = {
  images: StaticImageData[];
  value?: StaticImageData;
  onChange: (value: StaticImageData) => void;
};

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  images,
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (img: StaticImageData) => {
    onChange(img);
    setOpen(false); // dialog close
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 🔵 Trigger (Circular Avatar) */}
      <DialogTrigger asChild>
        <div className="cursor-pointer flex flex-col items-center gap-2">
          <Avatar className="w-20 h-20 border-2 border-primary">
            {value ? (
              <AvatarImage src={value.src} />
            ) : (
              <AvatarFallback>+</AvatarFallback>
            )}
          </Avatar>
          <p className="text-sm text-muted-foreground">Select Avatar</p>
        </div>
      </DialogTrigger>

      {/* 📦 Dialog Content */}
      <DialogContent className="min-w-3xl bg-white w-3xl flex flex-col">
        <DialogTitle className="text-lg font-semibold mb-4">
          Choose your avatar
        </DialogTitle>

        <div className="grid grid-cols-5 gap-4  max-h-[400px] overflow-y-auto">
          {images.map((img, index) => {
            const isSelected = value?.src === img.src;

            return (
              <Card
                key={index}
                onClick={() => handleSelect(img)}
                className={cn(
                  "cursor-pointer min-w-40 min-h-40 p-2 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-primary scale-105"
                    : "border-transparent hover:border-gray-300",
                )}
              >
                <Image
                  src={img}
                  alt={`avatar-${index}`}
                  width={200}
                  height={200}
                  className="rounded-lg object-cover"
                />
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarPicker;
