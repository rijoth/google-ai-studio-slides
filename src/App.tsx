// Purpose: Root React component — routing between presentation and admin dashboard
// Responsibilities: Set up React Router, load initial data, provide theme
// Public interfaces: App component
// Dependencies: react, react-router-dom, @mui/material, ./store/*, ./theme
// Related files: src/components/*, src/main.tsx

import React, { useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSettingsStore } from './store/settingsStore';
import { usePresentationStore } from './store/presentationStore';
import { createAppTheme } from './theme';
import PresentationView from './components/Presentation/PresentationView';
import Dashboard from './components/Dashboard/Dashboard';

export default function App() {
  const { settings, loadSettings } = useSettingsStore();
  const { loadPresentation } = usePresentationStore();

  useEffect(() => {
    loadSettings();
    loadPresentation();
  }, []);

  const theme = useMemo(() => {
    if (settings) return createAppTheme(settings);
    return createAppTheme({
      primaryColor: '#4285F4',
      secondaryColor: '#A142F4',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      cornerRadius: 22,
      shadowLevel: 2,
    } as any);
  }, [settings]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PresentationView />} />
          <Route path="/admin/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
