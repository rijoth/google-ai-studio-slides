// Purpose: Settings Panel — edit presentation metadata, instructor info, behavior settings
// Responsibilities: Form for all settings fields, auto-save on change
// Public interfaces: SettingsPanel component
// Dependencies: react, @mui/material, ../../store/settingsStore
// Related files: Dashboard.tsx, ../../store/settingsStore.ts

import React, { useEffect, useState } from 'react';
import {
  Box, Typography, TextField, Switch, FormControlLabel, Select, MenuItem,
  InputLabel, FormControl, Slider, Grid, Button, Paper, Divider, Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { useSettingsStore } from '../../store/settingsStore';

export default function SettingsPanel() {
  const { settings, loadSettings, updateSettings } = useSettingsStore();
  const [local, setLocal] = useState(settings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!settings) loadSettings();
    else setLocal(settings);
  }, [settings]);

  if (!local) return <Typography>Loading...</Typography>;

  const handleChange = (field: string, value: any) => {
    const updated = { ...local, [field]: value };
    setLocal(updated);
    updateSettings({ [field]: value });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Settings</Typography>
        {saved && <Alert severity="success" sx={{ py: 0 }}>Saved</Alert>}
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Presentation Info</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Presentation Title"
              value={local.presentationTitle}
              onChange={e => handleChange('presentationTitle', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Instructor Name"
              value={local.instructorName}
              onChange={e => handleChange('instructorName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Course Name"
              value={local.courseName}
              onChange={e => handleChange('courseName', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date"
              value={local.date}
              onChange={e => handleChange('date', e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Display</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Theme</InputLabel>
              <Select value={local.theme} label="Theme" onChange={e => handleChange('theme', e.target.value)}>
                <MenuItem value="material3">Material 3</MenuItem>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Slide Transition</InputLabel>
              <Select value={local.transition} label="Slide Transition" onChange={e => handleChange('transition', e.target.value)}>
                <MenuItem value="fade">Fade</MenuItem>
                <MenuItem value="slide">Slide</MenuItem>
                <MenuItem value="zoom">Zoom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Default Font"
              value={local.fontFamily}
              onChange={e => handleChange('fontFamily', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Accent Color"
              type="color"
              value={local.accentColor || local.primaryColor}
              onChange={e => handleChange('accentColor', e.target.value)}
              sx={{ '& input': { height: 40 } }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Behavior</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.showSpeakerNotes} onChange={e => handleChange('showSpeakerNotes', e.target.checked)} />}
              label="Show Speaker Notes"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.fullscreenOnStart} onChange={e => handleChange('fullscreenOnStart', e.target.checked)} />}
              label="Fullscreen on Start"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.autoSave} onChange={e => handleChange('autoSave', e.target.checked)} />}
              label="Auto Save"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.speakerTimer} onChange={e => handleChange('speakerTimer', e.target.checked)} />}
              label="Speaker Timer"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.enableKeyboardShortcuts} onChange={e => handleChange('enableKeyboardShortcuts', e.target.checked)} />}
              label="Keyboard Shortcuts"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControlLabel
              control={<Switch checked={local.enableAnimations} onChange={e => handleChange('enableAnimations', e.target.checked)} />}
              label="Enable Animations"
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Image Compression Level</Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={local.imageCompressionLevel}
            onChange={(_, v) => handleChange('imageCompressionLevel', v)}
            min={10}
            max={100}
            step={5}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${v}%`}
          />
        </Box>
      </Paper>
    </Box>
  );
}
