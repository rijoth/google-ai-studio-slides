// Purpose: Slide Browser — displays all slides as cards with image management
// Responsibilities: Show slide cards with thumbnails, upload/replace screenshots, remove/restore, preview
// Public interfaces: SlideBrowser component
// Dependencies: react, @mui/material, framer-motion, ../../store/presentationStore, ../../api/client
// Related files: Dashboard.tsx, ImageUploader.tsx

import React, { useState, useCallback, useRef } from 'react';
import {
  Box, Card, CardContent, CardMedia, Typography, Button, IconButton, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, Tooltip,
  CircularProgress, Alert, Snackbar,
} from '@mui/material';
import {
  Upload as UploadIcon, Delete as DeleteIcon, Preview as PreviewIcon,
  Restore as RestoreIcon, Close as CloseIcon, CloudUpload as CloudUploadIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { usePresentationStore } from '../../store/presentationStore';
import { uploadImage, updateSlide } from '../../api/client';
import type { Slide, ImageSlot } from '../../types';

export default function SlideBrowser() {
  const { presentation, updateSlideImages, loadPresentation } = usePresentationStore();
  const [selectedSlide, setSelectedSlide] = useState<Slide | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewSlide, setPreviewSlide] = useState<Slide | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const slides = presentation?.slides || [];

  const handleUpload = useCallback(async (slideId: string, slotName: string, file: File) => {
    setUploading(`${slideId}:${slotName}`);
    try {
      const result = await uploadImage(file);
      await updateSlideImages(slideId, { [slotName]: result.path });
      setSnackbar({ open: true, message: `Screenshot uploaded for "${slotName}"`, severity: 'success' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setUploading(null);
    }
  }, [updateSlideImages]);

  const handleRemove = useCallback(async (slideId: string, slotName: string) => {
    await updateSlideImages(slideId, { [slotName]: '' });
    setSnackbar({ open: true, message: `Screenshot removed from "${slotName}"`, severity: 'success' });
  }, [updateSlideImages]);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };

  const handleDrop = useCallback(async (e: React.DragEvent, slideId: string, slotName: string) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      await handleUpload(slideId, slotName, file);
    }
  }, [handleUpload]);

  const handlePaste = useCallback(async (e: React.ClipboardEvent, slideId: string, slotName: string) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await handleUpload(slideId, slotName, file);
          return;
        }
      }
    }
  }, [handleUpload]);

  if (!presentation) return <Box sx={{ p: 4 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Slide Browser</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {slides.length} slides · Click any slide to manage screenshots
      </Typography>

      <Grid container spacing={2}>
        {slides.map((slide, idx) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={slide.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: 6 },
                }}
                onClick={() => setSelectedSlide(slide)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip label={`Part ${slide.part}`} size="small" color="primary" variant="outlined" />
                    <Chip
                      label={slide.imageSlots.length > 0
                        ? `${Object.keys(slide.images).filter(k => slide.images[k]).length}/${slide.imageSlots.length} images`
                        : 'No slots'}
                      size="small"
                      color={Object.keys(slide.images).filter(k => slide.images[k]).length > 0 ? 'success' : 'default'}
                    />
                  </Box>
                  <Typography variant="subtitle2" noWrap sx={{ mb: 0.5 }}>
                    Slide {idx + 1}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {slide.title?.replace(/<[^>]+>/g, '') || slide.eyebrow || 'Untitled'}
                  </Typography>
                  {slide.imageSlots.length > 0 && (
                    <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {slide.imageSlots.map(slot => {
                        const has = !!slide.images[slot.name];
                        return (
                          <Chip
                            key={slot.name}
                            label={slot.name}
                            size="small"
                            color={has ? 'success' : 'default'}
                            variant={has ? 'filled' : 'outlined'}
                          />
                        );
                      })}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Slide Detail Dialog */}
      <Dialog
        open={!!selectedSlide}
        onClose={() => setSelectedSlide(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedSlide && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{selectedSlide.title?.replace(/<[^>]+>/g, '') || selectedSlide.eyebrow || 'Slide Details'}</span>
                <IconButton onClick={() => setSelectedSlide(null)}><CloseIcon /></IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              {selectedSlide.imageSlots.length === 0 ? (
                <Typography color="text.secondary">This slide has no screenshot placeholders.</Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {selectedSlide.imageSlots.map(slot => (
                    <ImageSlotManager
                      key={slot.name}
                      slot={slot}
                      slideId={selectedSlide.id}
                      currentImage={selectedSlide.images[slot.name] || ''}
                      uploading={uploading === `${selectedSlide.id}:${slot.name}`}
                      onUpload={(file) => handleUpload(selectedSlide.id, slot.name, file)}
                      onRemove={() => handleRemove(selectedSlide.id, slot.name)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, selectedSlide.id, slot.name)}
                      onPaste={(e) => handlePaste(e, selectedSlide.id, slot.name)}
                    />
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => { setPreviewSlide(selectedSlide); setSelectedSlide(null); }} startIcon={<PreviewIcon />}>
                Preview
              </Button>
              <Button onClick={() => setSelectedSlide(null)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewSlide}
        onClose={() => setPreviewSlide(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Preview: {previewSlide?.title?.replace(/<[^>]+>/g, '') || ''}</span>
            <IconButton onClick={() => setPreviewSlide(null)}><CloseIcon /></IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {previewSlide && (
            <Box sx={{ minHeight: 400, position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid #e0e0e0' }}>
              <Box sx={{ p: 4, bgcolor: previewSlide.background || '#F8FAFC' }}>
                <Typography variant="h5" gutterBottom>
                  {previewSlide.title?.replace(/<[^>]+>/g, '') || previewSlide.eyebrow}
                </Typography>
                {previewSlide.imageSlots.map(slot => (
                  previewSlide.images[slot.name] ? (
                    <Box
                      key={slot.name}
                      component="img"
                      src={previewSlide.images[slot.name]}
                      alt={slot.label}
                      sx={{ mt: 2, maxWidth: '100%', maxHeight: 300, borderRadius: 1 }}
                    />
                  ) : (
                    <Box key={slot.name} sx={{ mt: 2, p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fafafa' }}>
                      <Typography variant="subtitle2" gutterBottom>{slot.label}</Typography>
                      <Typography variant="body2" color="text.secondary" fontStyle="italic">
                        {slot.description || 'No image uploaded'}
                      </Typography>
                    </Box>
                  )
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
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

// Sub-component for managing a single image slot
function ImageSlotManager({
  slot, slideId, currentImage, uploading, onUpload, onRemove, onDragOver, onDrop, onPaste,
}: {
  slot: ImageSlot;
  slideId: string;
  currentImage: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  onRemove: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onPaste: (e: React.ClipboardEvent) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      sx={{
        border: '2px dashed',
        borderColor: currentImage ? 'success.main' : 'grey.300',
        borderRadius: 2,
        p: 2,
        bgcolor: currentImage ? 'success.50' : 'grey.50',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: 'primary.main' },
      }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onPaste={onPaste}
      tabIndex={0}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {!currentImage && (
          <Typography variant="subtitle1" fontWeight={600}>{slot.label}</Typography>
        )}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          {currentImage && (
            <>
              <Tooltip title="Remove">
                <IconButton size="small" color="error" onClick={onRemove}><DeleteIcon /></IconButton>
              </Tooltip>
            </>
          )}
          <Button
            size="small"
            variant="outlined"
            startIcon={uploading ? <CircularProgress size={16} /> : <CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : currentImage ? 'Replace' : 'Upload'}
          </Button>
        </Box>
      </Box>

      {slot.description && !currentImage && (
        <Typography variant="body2" color="text.secondary" fontStyle="italic" sx={{ mb: 1 }}>
          {slot.description}
        </Typography>
      )}

      {currentImage && (
        <Box
          component="img"
          src={currentImage}
          alt={slot.label}
          sx={{
            maxWidth: '100%',
            maxHeight: 250,
            borderRadius: 1,
            display: 'block',
            mt: 1,
          }}
        />
      )}

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Drag & drop, browse, or paste from clipboard
      </Typography>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </Box>
  );
}
