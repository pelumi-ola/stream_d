"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { StreamdLogo, CircleArrowRight } from "@/assets";
import Image from "next/image";

export function SubscriptionModal({ isOpen, onClose, videoType }) {
  if (!isOpen) return null;

  const message =
    videoType === "highlight"
      ? "Subscribe to Stream D to watch this soccer highlight."
      : "Subscribe to Stream D to watch the Match highlight.";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-[300px] relative">
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 bg-primary rounded-full hover:text-gray-700 hover:bg-hover-button dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5 text-white" />
        </Button>

        {/* Stream D Logo */}
        <div className="flex justify-center">
          <Image
            src={StreamdLogo}
            alt="logo"
            width={80}
            height={80}
            priority
            style={{ width: "80px", height: "auto" }} // ✅ keeps natural ratio
            className="max-h-[80px]" // ✅ ensures it won't grow too big
          />
        </div>
        {/* <div className="flex items-center justify-center">
          <Image src={StreamdLogo} alt="Logo" width={80} height={80} />
        </div> */}

        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/login" className="relative block">
            <Button className="flex justify-start w-full h-12 bg-primary hover:bg-hover-button text-white font-bold rounded-full">
              Get Started
            </Button>
            <CircleArrowRight className="absolute text-center text-white top-3 right-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
