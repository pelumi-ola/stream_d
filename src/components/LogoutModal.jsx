"use client";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Image from "next/image";
import { StreamdLogo } from "@/assets";

export function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-[350px] relative shadow-lg">
        {/* Close button */}
        <Button
          variant="ghost"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Button>

        {/* Logo */}
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
        {/* <div className="flex items-center justify-center mb-6">
          <Image src={StreamdLogo} alt="Logo" width={70} height={70} />
        </div> */}

        {/* Message */}
        <div className="text-center mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Are you sure you want to logout?
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            You will be logged out of the app and will need to log in again.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-24 border-gray-300 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600"
          >
            No
          </Button>
          <Button
            onClick={onConfirm}
            className="w-24 bg-red-600 hover:bg-red-700 text-white"
          >
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
}
