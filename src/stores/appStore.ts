import { create } from 'zustand';
import { CaptureState, Theme, Lead } from '@/types';

interface AppStore extends CaptureState {
  // Actions
  addCapturedPhoto: (photo: string) => void;
  selectPhoto: (photo: string) => void;
  selectTheme: (theme: Theme) => void;
  setGeneratedImage: (image: string) => void;
  setFinalImage: (image: string) => void;
  setLeadData: (lead: Partial<Lead>) => void;
  resetCapture: () => void;
  clearPhotos: () => void;
}

const initialState: CaptureState = {
  capturedPhotos: [],
  selectedPhoto: null,
  selectedTheme: null,
  generatedImage: null,
  finalImage: null,
  leadData: null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,

  addCapturedPhoto: (photo) =>
    set((state) => ({
      capturedPhotos: [...state.capturedPhotos, photo],
    })),

  selectPhoto: (photo) =>
    set({
      selectedPhoto: photo,
    }),

  selectTheme: (theme) =>
    set({
      selectedTheme: theme,
    }),

  setGeneratedImage: (image) =>
    set({
      generatedImage: image,
    }),

  setFinalImage: (image) =>
    set({
      finalImage: image,
    }),

  setLeadData: (lead) =>
    set((state) => ({
      leadData: { ...state.leadData, ...lead },
    })),

  resetCapture: () =>
    set({
      ...initialState,
    }),

  clearPhotos: () =>
    set({
      capturedPhotos: [],
      selectedPhoto: null,
    }),
}));
