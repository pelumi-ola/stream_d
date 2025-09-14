"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackButton({ href, onClick, label = "Back" }) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) return onClick();
    if (href) return router.push(href);
    router.back();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleBack}
      className="flex items-center gap-2 bg-primary text-hover hover:text-primary hover:bg-hover-button rounded-full px-5 py-2"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </Button>
  );
}
