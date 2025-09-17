// store/useAuthStore.js
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      timeLeft: null,

      setUser: (userData) => {
        set({ user: userData });
      },

      setTimeLeft: (seconds) => set({ timeLeft: seconds }),

      clearUser: () => set({ user: null, timeLeft: null }),
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
