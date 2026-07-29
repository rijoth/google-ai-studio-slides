// Purpose: Image Library — media manager with grid view, search, filter, delete, preview
// Responsibilities: List all uploaded images, search/filter, delete, show usage info
// Public interfaces: ImageLibrary component
// Dependencies: react, @mui/material, ../../api/client
// Related files: Dashboard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, TextField, Grid, Card, CardMedia, CardContent, CardActions,
  IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, CircularProgress, InputAdornment, Alert, Snackbar,
} from '@mui/material';
import {
  Delete as DeleteIcon, Search as SearchIcon, Preview as PreviewIcon,
  Refresh as RefreshIcon, Image as ImageIcon,
} from '@mui/icons-material';
import { fetchImages, deleteImage as apiDeleteImage } from '../../api/client';
import type { ImageInfo } from '../../types';

export default function ImageLibrary() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState<ImageInfo | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ImageInfo | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchImages();
      setImages(data);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await apiDeleteImage(deleteConfirm.filename);
      setSnackbar({ open: true, message: `Deleted ${deleteConfirm.filename}`, severity: 'success' });
      setDeleteConfirm(null);
      load();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const filtered = images.filter(img =>
    img.filename.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Image Library</Typography>
        <Button startIcon={<RefreshIcon />} onClick={load}>Refresh</Button>
      </Box>

      <TextField
        fullWidth
        placeholder="Search images..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
        }}
      />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 6 }}>
          <ImageIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography color="text.secondary">
            {search ? 'No images match your search' : 'No images uploaded yet'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(img => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={img.filename}>
              <Card>
                <CardMedia
                  component="img"
                  height="160"
                  image={img.thumbnail || img.path}
                  alt={img.filename}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => setPreview(img)}
                />
                <CardContent sx={{ pb: 0 }}>
                  <Typography variant="body2" noWrap title={img.filename}>
                    {img.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatSize(img.size)} · {new Date(img.uploadedAt).toLocaleDateString()}
                  </Typography>
                  {img.usedBy.length > 0 && (
                    <Box sx={{ mt: 0.5 }}>
                      <Chip label={`Used in ${img.usedBy.length} slide(s)`} size="small" color="primary" variant="outlined" />
                    </Box>
                  )}
                </CardContent>
                <CardActions>
                  <IconButton size="small" onClick={() => setPreview(img)}><PreviewIcon /></IconButton>
                  <IconButton size="small" color="error" onClick={() => setDeleteConfirm(img)}><DeleteIcon /></IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!preview} onClose={() => setPreview(null)} maxWidth="md" fullWidth>
        <DialogTitle>{preview?.filename}</DialogTitle>
        <DialogContent>
          {preview && (
            <Box>
              <Box
                component="img"
                src={preview.path}
                alt={preview.filename}
                sx={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: 1 }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Size: {formatSize(preview.size)}</Typography>
                <Typography variant="body2">Uploaded: {new Date(preview.uploadedAt).toLocaleString()}</Typography>
                {preview.usedBy.length > 0 && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle2">Used by:</Typography>
                    {preview.usedBy.map((u, i) => (
                      <Chip key={i} label={u} size="small" sx={{ mr: 0.5, mt: 0.5 }} />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreview(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Image?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{deleteConfirm?.filename}</strong>?
            {deleteConfirm && deleteConfirm.usedBy.length > 0 && (
              <span> This image is used in {deleteConfirm.usedBy.length} slide(s).</span>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
