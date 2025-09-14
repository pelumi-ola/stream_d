"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { StreamdLogo } from "@/assets";

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  buttons = [
    {
      label: "Close",
      variant: "default", // "default" | "error" | "primary"
      action: onClose,
    },
  ],
}) {
  const getButtonClasses = (variant) => {
    switch (variant) {
      case "error":
        return "bg-red-600 hover:bg-red-700";
      case "primary":
        return "bg-primary hover:bg-hover-button";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl p-8 border-none shadow-2xl">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Image src={StreamdLogo} alt="Logo" width={80} height={80} />
        </div>

        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold text-gray-800 mb-4">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="text-center mb-8">
          <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        <div className="flex flex-col gap-3">
          {buttons.map((btn, i) => (
            <Button
              key={i}
              onClick={btn.action}
              className={`w-full h-12 text-white font-semibold rounded-full ${getButtonClasses(
                btn.variant
              )}`}
            >
              {btn.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

