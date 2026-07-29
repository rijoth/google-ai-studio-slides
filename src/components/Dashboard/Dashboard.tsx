// Purpose: Dashboard main layout — admin interface for managing presentation
// Responsibilities: Tab navigation between Slide Browser, Settings, Theme Editor, Image Library, Backup
// Public interfaces: Dashboard component
// Dependencies: react, react-router-dom, @mui/material, ./SlideBrowser, ./SettingsPanel, ./ThemeEditor, ./ImageLibrary, ./BackupRestore
// Related files: src/App.tsx

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, IconButton, useMediaQuery, useTheme, CssBaseline,
} from '@mui/material';
import {
  Slideshow as SlidesIcon, Settings as SettingsIcon, Palette as PaletteIcon,
  PhotoLibrary as ImageLibIcon, Backup as BackupIcon, Home as HomeIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import SlideBrowser from './SlideBrowser';
import SettingsPanel from './SettingsPanel';
import ThemeEditor from './ThemeEditor';
import ImageLibrary from './ImageLibrary';
import BackupRestore from './BackupRestore';

const DRAWER_WIDTH = 260;

const navItems = [
  { path: '/admin', label: 'Slide Browser', icon: <SlidesIcon /> },
  { path: '/admin/settings', label: 'Settings', icon: <SettingsIcon /> },
  { path: '/admin/theme', label: 'Theme Editor', icon: <PaletteIcon /> },
  { path: '/admin/images', label: 'Image Library', icon: <ImageLibIcon /> },
  { path: '/admin/backup', label: 'Backup & Restore', icon: <BackupIcon /> },
];

export default function Dashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const drawerContent = (
    <Box sx={{ pt: 1 }}>
      <List>
        {navItems.map(item => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); if (isMobile) setMobileOpen(false); }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <List>
        <ListItemButton onClick={() => window.open('/', '_blank')}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="View Presentation" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>Presenter Dashboard</Typography>
        </Toolbar>
      </AppBar>

      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            flexShrink: 0,
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box' },
          }}
        >
          <Toolbar />
          {drawerContent}
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Routes>
          <Route index element={<SlideBrowser />} />
          <Route path="settings" element={<SettingsPanel />} />
          <Route path="theme" element={<ThemeEditor />} />
          <Route path="images" element={<ImageLibrary />} />
          <Route path="backup" element={<BackupRestore />} />
        </Routes>
      </Box>
    </Box>
  );
}
