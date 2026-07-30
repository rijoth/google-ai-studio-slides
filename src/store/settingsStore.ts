// Purpose: Zustand store for app settings
// Responsibilities: Hold settings, provide load/save actions
// Public interfaces: useSettingsStore hook
// Dependencies: zustand, ../api/client, ../types
// Related files: src/components/Dashboard/SettingsPanel.tsx, src/theme.ts

import { create } from 'zustand';
import type { Settings } from '../types';
import { fetchSettings, saveSettings as apiSaveSettings } from '../api/client';
import embeddedSettings from '../data/settings.json';

interface SettingsState {
  settings: Settings | null;
  loading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
  saveCurrentSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: embeddedSettings as Settings,
  loading: false,
  error: null,

  loadSettings: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchSettings();
      set({ settings: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateSettings: async (partial: Partial<Settings>) => {
    const current = get().settings;
    if (!current) return;
    const updated = { ...current, ...partial };
    set({ settings: updated });
    await apiSaveSettings(updated);
  },

  saveCurrentSettings: async () => {
    const current = get().settings;
    if (current) await apiSaveSettings(current);
  },
}));
