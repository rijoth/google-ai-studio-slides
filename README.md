# Google AI Studio & Antigravity

Interactive presentation deck on the topic **Building Apps with Google AI Studio & Antigravity**.

Built with React + Vite frontend, Express backend, Sharp for image processing. Slides, themes, and images managed through an admin dashboard.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173` — presentation view. Append `/admin` for the dashboard.

## Project Structure

```
├── server/              # Express API
│   ├── routes/          # upload, slides, images, settings, backup
│   ├── middleware/       # multer file upload config
│   ├── utils/           # sharp image processing
│   └── storage/         # db defaults + seed data
├── src/                 # React frontend (Vite)
│   ├── components/      # Dashboard, Presentation, SlideBrowser, etc.
│   ├── store/           # Zustand state management
│   ├── api/             # API client
│   └── types/           # TypeScript interfaces
├── storage/             # Persistent JSON (presentation, settings, images)
└── vite.config.ts
```

## Features

- Slide browser with image slot management (upload/replace/remove)
- Image processing (resize, optimize, thumbnails) via Sharp
- Theme editor (colors, fonts, corner radius, shadows)
- Live preview
- Backup/restore (zip export/import)
- Speaker notes support
- Keyboard shortcuts, animations, fullscreen mode

## Tech Stack

| Layer    | Tools |
|----------|-------|
| Frontend | React 18, MUI 6, Framer Motion, Zustand |
| Backend  | Express, Multer, Sharp |
| Build    | Vite, TypeScript, tsx |

## License

MIT
