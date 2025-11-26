import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "light",

  setTheme: (mode) => {
    if (!["light", "dark"].includes(mode)) {
      mode = "light"; // safe fallback
    }

    localStorage.setItem("chat-theme", mode);
    set({ theme: mode });
  },
}));
