import { create } from 'zustand';

type GeneralState = {
  saveEnabled: boolean;
  setSaveEnabled: (saveEnabled: boolean) => void;
};

export const useGeneralStore = create<GeneralState>()((set) => ({
  saveEnabled: false,
  setSaveEnabled: (saveEnabled) => set({ saveEnabled }),
}));
