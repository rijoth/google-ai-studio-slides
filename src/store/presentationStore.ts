// Purpose: Zustand store for presentation data
// Responsibilities: Hold current presentation, provide actions to load/update slides
// Public interfaces: usePresentationStore hook
// Dependencies: zustand, ../api/client, ../types
// Related files: src/components/*, server/storage/db.ts

import { create } from 'zustand';
import type { Presentation, Slide } from '../types';
import { fetchPresentation, updateSlide as apiUpdateSlide } from '../api/client';

interface PresentationState {
  presentation: Presentation | null;
  loading: boolean;
  error: string | null;
  loadPresentation: () => Promise<void>;
  updateSlideImages: (slideId: string, images: Record<string, string>) => Promise<void>;
  setPresentation: (data: Presentation) => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  presentation: null,
  loading: false,
  error: null,

  loadPresentation: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchPresentation();
      set({ presentation: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateSlideImages: async (slideId: string, images: Record<string, string>) => {
    const updated = await apiUpdateSlide(slideId, { images } as any);
    const pres = get().presentation;
    if (pres) {
      const slides = pres.slides.map(s => s.id === slideId ? { ...s, images: updated.images } : s);
      set({ presentation: { ...pres, slides } });
    }
  },

  setPresentation: (data: Presentation) => set({ presentation: data }),
}));
