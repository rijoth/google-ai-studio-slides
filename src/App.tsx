// Purpose: Root React component — routing between presentation and admin dashboard
// Responsibilities: Set up React Router, load initial data, provide theme
// Public interfaces: App component
// Dependencies: react, react-router-dom, @mui/material, ./store/*, ./theme
// Related files: src/components/*, src/main.tsx

import React, { useEffect, useMemo, Component } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSettingsStore } from './store/settingsStore';
import { usePresentationStore } from './store/presentationStore';
import { createAppTheme } from './theme';
import PresentationView from './components/Presentation/PresentationView';
import Dashboard from './components/Dashboard/Dashboard';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', gap: 16, padding: 40 }}>
          <div style={{ fontSize: '1.2rem', color: '#EA4335', fontWeight: 600 }}>Something went wrong</div>
          <div style={{ color: '#475569', fontSize: '0.9rem', maxWidth: 500, textAlign: 'center', wordBreak: 'break-word' }}>{this.state.error?.message}</div>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', background: '#4285F4', color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PresentationView />} />
            <Route path="/admin/*" element={<Dashboard />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
