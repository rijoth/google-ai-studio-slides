// Purpose: API client for frontend — typed fetch wrappers
// Responsibilities: All HTTP calls to the backend REST API
// Public interfaces: fetchPresentation, fetchSettings, saveSettings, updateSlide, uploadImage, fetchImages, deleteImage, exportBackup, importBackup
// Dependencies: none (fetch API)
// Related files: src/store/*, src/components/*

import type { Presentation, Settings, Slide, UploadResponse, ImageInfo, ApiResponse } from '../types';

const BASE = '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function fetchPresentation(): Promise<Presentation> {
  const res = await request<ApiResponse<Presentation>>('/api/presentation');
  return res.data!;
}

export async function saveFullPresentation(data: Presentation): Promise<void> {
  await request('/api/presentation', { method: 'PUT', body: JSON.stringify(data) });
}

export async function fetchSettings(): Promise<Settings> {
  const res = await request<ApiResponse<Settings>>('/api/settings');
  return res.data!;
}

export async function saveSettings(data: Settings): Promise<void> {
  await request('/api/settings', { method: 'PUT', body: JSON.stringify(data) });
}

export async function updateSlide(id: string, updates: Partial<Slide>): Promise<Slide> {
  const res = await request<ApiResponse<Slide>>(`/api/slides/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return res.data!;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', { method: 'POST', body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Upload failed');
  }
  return res.json();
}

export async function fetchImages(): Promise<ImageInfo[]> {
  const res = await request<ApiResponse<ImageInfo[]>>('/api/images');
  return res.data!;
}

export async function deleteImage(filename: string): Promise<void> {
  await request(`/api/images/${encodeURIComponent(filename)}`, { method: 'DELETE' });
}

export function getExportUrl(): string {
  return '/api/backup/export';
}

export async function importBackup(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('backup', file);
  const res = await fetch('/api/backup/import', { method: 'POST', body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Import failed');
  }
}
