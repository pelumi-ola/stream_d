"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/store/useAuthStore";
import { useUserInteractionsContext } from "@/context/UserInteractionsContext";
import { LogoutModal } from "@/components/LogoutModal";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { user, setUser, clearUser, setTimeLeft, timeLeft } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const logoutTimer = useRef(null);
  const intervalRef = useRef(null);
  const router = useRouter();
  const { loadAllInteractions } = useUserInteractionsContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Restore persisted user automatically handled by Zustand persist
  useEffect(() => {
    if (user && user.status === "active" && user.session_expires_at) {
      const expiry = new Date(user.session_expires_at).getTime();
      const now = Date.now();

      if (isNaN(expiry)) {
        console.warn("Invalid session_expires_at:", user.session_expires_at);
        clearUser();
        setLoading(false);
        return;
      }

      if (expiry > now) {
        const remaining =
          user.remaining_seconds !== undefined &&
          user.remaining_seconds !== null
            ? Number(user.remaining_seconds)
            : Math.floor((expiry - now) / 1000);

        setTimeLeft(remaining);
        scheduleAutoLogout(user.session_expires_at);
        startCountdown(remaining, user.session_expires_at);
        loadAllInteractions(user.subscriber_id);
      } else {
        clearUser(); // already expired
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
  const startCountdown = (seconds, expiresAt) => {
    if (!seconds || isNaN(seconds)) {
      console.warn("Invalid countdown start value:", seconds);
      logout(true);
      return;
    }

    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(seconds);

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = Math.floor(
        (new Date(expiresAt).getTime() - now) / 1000
      );

      if (remaining > 0) {
        setTimeLeft(remaining);
      } else {
        clearInterval(intervalRef.current);
        logout(true);
      }
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
      const expiry = new Date(activeUser.session_expires_at).getTime();
      const now = Date.now();

      if (isNaN(expiry)) {
        console.warn(
          "Invalid session_expires_at:",
          activeUser.session_expires_at
        );
        clearUser();
        return;
      }

      const remaining =
        activeUser.remaining_seconds !== undefined &&
        activeUser.remaining_seconds !== null
          ? Number(activeUser.remaining_seconds)
          : Math.floor((expiry - now) / 1000);

      setUser(activeUser);
      setTimeLeft(remaining);
      scheduleAutoLogout(activeUser.session_expires_at);
      startCountdown(remaining, activeUser.session_expires_at);
      loadAllInteractions(activeUser.subscriber_id);
    }
  };

  // Logout function
  const logout = (isAuto = false) => {
    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    clearUser();
    setTimeLeft(null);

    // Set logout reason FIRST
    if (isAuto) {
      toast.error("Your session has expired. Please subscribe again.");
      localStorage.setItem("logoutReason", "auto");
    } else {
      toast.success("You have been logged out.");
      localStorage.setItem("logoutReason", "manual");
    }

    router.push("/");
  };

  // Manual logout request → shows modal
  const requestLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    logout(false); // manual logout
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        requestLogout,
        loading,
        setTimeLeft,
        timeLeft,
      }}
    >
      {children}
      {/* Global Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={cancelLogout}
        onConfirm={confirmLogout}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
