"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      timeLeft: null,
      lastMsisdn: null,

      setUser: (userData) => {
        set({
          user: userData,
          lastMsisdn: userData.msisdn,
        });
      },

      setTimeLeft: (seconds) => set({ timeLeft: seconds }),

      clearUser: () => set({ user: null, timeLeft: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
      // 👇 Only persist user + lastMsisdn, not timeLeft
      partialize: (state) => ({
        user: state.user,
        lastMsisdn: state.lastMsisdn,
      }),
    }
  )
);
