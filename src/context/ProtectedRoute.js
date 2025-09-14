"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.status !== "active")) {
      const reason = localStorage.getItem("logoutReason");
      if (reason !== "manual") {
        toast.error("You must be logged in with an active subscription.");
      }
      localStorage.removeItem("logoutReason");

      router.replace("/");
    }
}, [user, loading, router]);

  if (loading) return <p>Loading...</p>;
  if (!user || user.status !== "active") return null;

  return <>{children}</>;
}
