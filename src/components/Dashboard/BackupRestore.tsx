// Purpose: Backup & Restore — export/import presentation configuration and images
// Responsibilities: Download ZIP backup, upload and restore ZIP
// Public interfaces: BackupRestore component
// Dependencies: react, @mui/material, ../../api/client
// Related files: Dashboard.tsx

import React, { useState, useRef } from 'react';
import {
  Box, Typography, Paper, Button, Divider, Alert, CircularProgress, Snackbar,
} from '@mui/material';
import {
  Download as DownloadIcon, Upload as UploadIcon, Restore as RestoreIcon,
} from '@mui/icons-material';
import { getExportUrl, importBackup } from '../../api/client';

export default function BackupRestore() {
  const [importing, setImporting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    window.open(getExportUrl(), '_blank');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      setSnackbar({ open: true, message: 'Please select a .zip backup file', severity: 'error' });
      e.target.value = '';
      return;
    }

    setImporting(true);
    try {
      await importBackup(file);
      setSnackbar({ open: true, message: 'Backup restored successfully! Refresh the page to see changes.', severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Backup & Restore</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Export your presentation configuration and all images, or restore from a previous backup
      </Typography>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Export Configuration</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Downloads a ZIP file containing <code>presentation.json</code>, <code>settings.json</code>, and all uploaded images.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Download Backup ZIP
        </Button>
      </Paper>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>Import & Restore</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Restore a previously exported backup. This will overwrite current configuration and images.
        </Typography>
        <Alert severity="warning" sx={{ mb: 2 }}>
          This will replace all current data. Make sure to export a backup first.
        </Alert>
        <Button
          variant="outlined"
          size="large"
          color="warning"
          startIcon={importing ? <CircularProgress size={20} /> : <RestoreIcon />}
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
        >
          {importing ? 'Importing...' : 'Import Backup ZIP'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
