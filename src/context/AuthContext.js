// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUserInteractionsContext } from "@/context/UserInteractionsContext";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const logoutTimer = useRef(null);
  const intervalRef = useRef(null);
  const router = useRouter();

  const { loadAllInteractions } = useUserInteractionsContext();

  // restore user on page refresh
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (parsed.status === "active" && parsed.session_expires_at) {
          const expiry = new Date(parsed.session_expires_at).getTime();
          if (expiry > Date.now()) {
            const remaining_seconds = Math.floor((expiry - Date.now()) / 1000);

            setUser(parsed);
            setTimeLeft(remaining_seconds);

            scheduleAutoLogout(parsed.session_expires_at);
            startCountdown(remaining_seconds);
            loadAllInteractions(parsed.subscriber_id);
          } else {
            // session expired
            localStorage.removeItem("user");
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // sync auth state across tabs
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "user") {
        const updated = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(updated);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const scheduleAutoLogout = (expiresAt) => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    const expiryTime = new Date(expiresAt).getTime();
    const now = Date.now();
    const remaining = expiryTime - now;

    if (remaining > 0) {
      logoutTimer.current = setTimeout(() => {
        logout(true);
      }, remaining);
    } else {
      logout(true);
    }
  };

  const startCountdown = (seconds) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(seconds);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev > 1) {
          return prev - 1;
        } else {
          clearInterval(intervalRef.current);
          logout(true);
          return 0;
        }
      });
    }, 1000);
  };

  const login = (userData) => {
    if (userData.status === "active") {
      const activeUser = {
        token: userData.session_token,
        session_expires_at: userData.session_expires_at, // ✅ store exact backend key
        msisdn: userData.msisdn,
        status: userData.status,
        subscriber_id: userData.subscriber_id,
        start_time: userData.start_time,
        end_time: userData.end_time,
        is_first_time: userData.is_first_time,
      };

      const remaining_seconds = Math.floor(
        (new Date(activeUser.session_expires_at).getTime() - Date.now()) / 1000
      );

      setUser(activeUser);
      setTimeLeft(remaining_seconds);
      localStorage.setItem("user", JSON.stringify(activeUser));
      console.log("[Auth Debug] saved user to localStorage:", activeUser);

      scheduleAutoLogout(activeUser.session_expires_at);
      startCountdown(remaining_seconds);
      loadAllInteractions(activeUser.subscriber_id);
    } else {
      setUser(null);
      setTimeLeft(null);
      localStorage.removeItem("user");
    }
  };

  const logoutReasonKey = "logoutReason";
  const logout = (isAuto = false) => {
    setUser(null);
    setTimeLeft(null);
    localStorage.removeItem("user");

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (isAuto) {
      localStorage.setItem(logoutReasonKey, "auto");
      toast.error("Your session has expired. Please log in again.");
    } else {
      localStorage.setItem(logoutReasonKey, "manual");
      toast.success("You have been logged out.");
    }

    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, timeLeft }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
