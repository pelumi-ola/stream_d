// "use client";
// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);

//   // Load from localStorage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Login and persist to localStorage
//   const login = (fakeUser = { name: "Test User" }) => {
//     setUser(fakeUser);
//     localStorage.setItem("user", JSON.stringify(fakeUser));
//   };

//   // Logout and clear storage
//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }

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
  const logoutTimer = useRef(null);
  const router = useRouter();

  const { loadAllInteractions } = useUserInteractionsContext();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (
        parsed.status === "active" &&
        parsed.expiresAt &&
        new Date(parsed.expiresAt) > new Date()
      ) {
        setUser(parsed);
        scheduleAutoLogout(parsed.expiresAt, parsed.remaining_seconds);

        loadAllInteractions(parsed.subscriber_id);
      } else {
        localStorage.removeItem("user");
      }
    }
     setLoading(false);
  }, []);

  const scheduleAutoLogout = (expiresAt, remainingSeconds) => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);

    let remaining;
    if (typeof remainingSeconds === "number" && remainingSeconds > 0) {
      remaining = remainingSeconds * 1000;
    } else {
      const expiryTime = new Date(expiresAt).getTime();
      const now = Date.now();
      remaining = expiryTime - now;
    }

    if (remaining > 0) {
      logoutTimer.current = setTimeout(() => {
        logout(true);
      }, remaining);
    } else {
      logout(true);
    }
  };

  const login = (userData) => {
    if (userData.status === "active") {
      const activeUser = {
        token: userData.session_token,
        expiresAt: userData.session_expires_at,
        msisdn: userData.msisdn,
        status: userData.status,
        subscriber_id: userData.subscriber_id,
        start_time: userData.start_time,
        end_time: userData.end_time,
        remaining_seconds: userData.remaining_seconds,
        is_first_time: userData.is_first_time,
      };
      setUser(activeUser);
      localStorage.setItem("user", JSON.stringify(activeUser));
      scheduleAutoLogout(activeUser.expiresAt, activeUser.remaining_seconds);
      loadAllInteractions(activeUser.subscriber_id);
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const logoutReasonKey = "logoutReason";
  const logout = (isAuto = false) => {
    setUser(null);
    localStorage.removeItem("user");

    if (logoutTimer.current) {
      clearTimeout(logoutTimer.current);
      logoutTimer.current = null;
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
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
