import { create } from "zustand";

type UiState = {
  selectedDate: string | null;
  openDay: (date: string) => void;
  closeDay: () => void;
  isChildModalOpen: boolean;
  openChildModal: () => void;
  closeChildModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedDate: null,
  openDay: (date) => set({ selectedDate: date }),
  closeDay: () => set({ selectedDate: null }),
  isChildModalOpen: false,
  openChildModal: () => set({ isChildModalOpen: true }),
  closeChildModal: () => set({ isChildModalOpen: false }),
}));
