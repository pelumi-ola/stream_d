"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/store/useAuthStore";
import { useUserInteractionsContext } from "@/context/UserInteractionsContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, setUser, clearUser, setTimeLeft } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null);
  const intervalRef = useRef(null);
  const router = useRouter();
  const { loadAllInteractions } = useUserInteractionsContext();

  // Restore persisted user automatically handled by Zustand persist
  useEffect(() => {
    if (user && user.status === "active" && user.session_expires_at) {
      const expiry = new Date(user.session_expires_at).getTime();
      if (expiry > Date.now()) {
        const remaining_seconds = Math.floor((expiry - Date.now()) / 1000);
        setTimeLeft(remaining_seconds);
        scheduleAutoLogout(user.session_expires_at);
        startCountdown(remaining_seconds);
        loadAllInteractions(user.subscriber_id);
      } else {
        clearUser();
      }
    }
    setLoading(false);
  }, [user]);

  // Schedule auto logout
  const scheduleAutoLogout = (expiresAt) => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    const remaining = new Date(expiresAt).getTime() - Date.now();
    if (remaining > 0) {
      logoutTimer.current = setTimeout(() => logout(true), remaining);
    } else {
      logout(true);
    }
  };

  // Countdown display
  const startCountdown = (seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 1) return prev - 1;
        clearInterval(intervalRef.current);
        logout(true);
        return 0;
      });
    }, 1000);
  };

  // Login function
  const login = (userData) => {
    if (userData.status === "active") {
      const activeUser = {
        token: userData.session_token,
        session_expires_at: userData.session_expires_at,
        msisdn: userData.msisdn,
        status: userData.status,
        subscriber_id: userData.subscriber_id,
        start_time: userData.start_time,
        end_time: userData.end_time,
        is_first_time: userData.is_first_time,
        remaining_seconds: userData.remaining_seconds,
      };

      const remaining_seconds =
        Math.floor(
          new Date(activeUser.session_expires_at).getTime() - Date.now()
        ) / 1000;

      setUser(activeUser); // persisted automatically
      setTimeLeft(remaining_seconds);
      scheduleAutoLogout(activeUser.session_expires_at);
      startCountdown(remaining_seconds);
      loadAllInteractions(activeUser.subscriber_id);
    }
  };

  // Logout function
  const logout = (isAuto = false) => {
    clearUser(); // clears persisted user

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isAuto) toast.error("Your session has expired. Please log in again.");
    else toast.success("You have been logged out.");

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setTimeLeft }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
