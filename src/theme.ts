// Purpose: Material UI theme configuration
// Responsibilities: Create MUI theme from settings, support dynamic updates
// Public interfaces: createAppTheme, muiTheme
// Dependencies: @mui/material, ../types
// Related files: src/main.tsx, src/store/settingsStore.ts

import { createTheme } from '@mui/material/styles';
import type { Settings } from '../types';

export function createAppTheme(settings: Settings) {
  return createTheme({
    palette: {
      primary: { main: settings.primaryColor },
      secondary: { main: settings.secondaryColor },
    },
    typography: {
      fontFamily: settings.fontFamily,
    },
    shape: {
      borderRadius: settings.cornerRadius,
    },
    shadows: [
      'none',
      `0 1px 2px rgba(0,0,0,${0.05 * settings.shadowLevel})`,
      `0 2px 4px rgba(0,0,0,${0.06 * settings.shadowLevel})`,
      `0 4px 8px rgba(0,0,0,${0.07 * settings.shadowLevel})`,
      `0 6px 12px rgba(0,0,0,${0.08 * settings.shadowLevel})`,
      `0 8px 16px rgba(0,0,0,${0.09 * settings.shadowLevel})`,
      `0 10px 20px rgba(0,0,0,${0.10 * settings.shadowLevel})`,
      `0 12px 24px rgba(0,0,0,${0.11 * settings.shadowLevel})`,
      `0 14px 28px rgba(0,0,0,${0.12 * settings.shadowLevel})`,
      `0 16px 32px rgba(0,0,0,${0.13 * settings.shadowLevel})`,
      `0 18px 36px rgba(0,0,0,${0.14 * settings.shadowLevel})`,
      `0 20px 40px rgba(0,0,0,${0.15 * settings.shadowLevel})`,
      `0 22px 44px rgba(0,0,0,${0.16 * settings.shadowLevel})`,
      `0 24px 48px rgba(0,0,0,${0.17 * settings.shadowLevel})`,
      `0 26px 52px rgba(0,0,0,${0.18 * settings.shadowLevel})`,
      `0 28px 56px rgba(0,0,0,${0.19 * settings.shadowLevel})`,
      `0 30px 60px rgba(0,0,0,${0.20 * settings.shadowLevel})`,
      `0 32px 64px rgba(0,0,0,${0.21 * settings.shadowLevel})`,
      `0 34px 68px rgba(0,0,0,${0.22 * settings.shadowLevel})`,
      `0 36px 72px rgba(0,0,0,${0.23 * settings.shadowLevel})`,
      `0 38px 76px rgba(0,0,0,${0.24 * settings.shadowLevel})`,
      `0 40px 80px rgba(0,0,0,${0.25 * settings.shadowLevel})`,
      `0 42px 84px rgba(0,0,0,${0.26 * settings.shadowLevel})`,
      `0 44px 88px rgba(0,0,0,${0.27 * settings.shadowLevel})`,
      `0 46px 92px rgba(0,0,0,${0.28 * settings.shadowLevel})`,
    ] as any,
  });
}
