// Purpose: Theme Editor — customize Material 3 tokens (color, typography, shape, shadows, spacing)
// Responsibilities: Color pickers for primary/secondary, border radius slider, shadow level, spacing
// Public interfaces: ThemeEditor component
// Dependencies: react, @mui/material, ../../store/settingsStore
// Related files: Dashboard.tsx, ../../theme.ts

import React from 'react';
import {
  Box, Typography, Paper, Grid, Slider, TextField, Divider,
} from '@mui/material';
import { useSettingsStore } from '../../store/settingsStore';

export default function ThemeEditor() {
  const { settings, updateSettings } = useSettingsStore();

  if (!settings) return <Typography>Loading...</Typography>;

  const handleChange = (field: string, value: any) => {
    updateSettings({ [field]: value });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Theme Editor</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Customize Material 3 design tokens
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Colors</Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Primary Color</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: settings.primaryColor, border: '2px solid #ccc',
                }}
              />
              <TextField
                type="color"
                value={settings.primaryColor}
                onChange={e => handleChange('primaryColor', e.target.value)}
                sx={{ '& input': { height: 40, width: 80 } }}
              />
              <TextField
                size="small"
                value={settings.primaryColor}
                onChange={e => handleChange('primaryColor', e.target.value)}
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" gutterBottom>Secondary Color</Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box
                sx={{
                  width: 40, height: 40, borderRadius: 2,
                  bgcolor: settings.secondaryColor, border: '2px solid #ccc',
                }}
              />
              <TextField
                type="color"
                value={settings.secondaryColor}
                onChange={e => handleChange('secondaryColor', e.target.value)}
                sx={{ '& input': { height: 40, width: 80 } }}
              />
              <TextField
                size="small"
                value={settings.secondaryColor}
                onChange={e => handleChange('secondaryColor', e.target.value)}
                sx={{ width: 120 }}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Preview</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { bg: settings.primaryColor, label: 'Primary' },
              { bg: settings.secondaryColor, label: 'Secondary' },
              { bg: lighten(settings.primaryColor, 0.7), label: 'Primary Light' },
              { bg: lighten(settings.secondaryColor, 0.7), label: 'Secondary Light' },
            ].map((swatch, i) => (
              <Box key={i} sx={{ textAlign: 'center' }}>
                <Box sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: swatch.bg, border: '1px solid #e0e0e0' }} />
                <Typography variant="caption">{swatch.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Typography</Typography>
        <TextField
          fullWidth
          label="Font Family"
          value={settings.fontFamily}
          onChange={e => handleChange('fontFamily', e.target.value)}
          helperText="CSS font-family value"
        />
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Corner Radius</Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={settings.cornerRadius}
            onChange={(_, v) => handleChange('cornerRadius', v)}
            min={0}
            max={40}
            step={2}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${v}px`}
          />
        </Box>
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          {[4, 8, 16, settings.cornerRadius].map((r, i) => (
            <Box
              key={i}
              sx={{
                width: 48, height: 48, bgcolor: settings.primaryColor,
                borderRadius: `${r}px`, opacity: r === settings.cornerRadius ? 1 : 0.4,
              }}
            />
          ))}
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Shadow Level</Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={settings.shadowLevel}
            onChange={(_, v) => handleChange('shadowLevel', v)}
            min={1}
            max={5}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Spacing</Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={settings.spacing}
            onChange={(_, v) => handleChange('spacing', v)}
            min={8}
            max={40}
            step={4}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `${v}px`}
          />
        </Box>
      </Paper>
    </Box>
  );
}

function lighten(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, '0')}${lg.toString(16).padStart(2, '0')}${lb.toString(16).padStart(2, '0')}`;
}
