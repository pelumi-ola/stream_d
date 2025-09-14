// store/useLoginStore.js
"use client";
import { create } from "zustand";

export const useLoginStore = create((set) => ({
  loading: false,
  modal: {
    open: false,
    title: "",
    message: "",
    actionText: "",
    actionLink: null,
    type: "info", // "login" | "subscribe" | "error"
  },
  setLoading: (loading) => set({ loading }),
  setModal: (modal) => set({ modal: { open: true, ...modal } }),
  closeModal: () =>
    set({
      modal: {
        open: false,
        title: "",
        message: "",
        actionText: "",
        actionLink: null,
      },
    }),
}));
