# LearningTheForce AI Reader

An AI-powered speed reading application with OCR support, intelligent text chunking, and synchronized highlighting.

## Features

- **Speed Reading**: Variable speed text display (200-1000 WPM)
- **OCR Support**: Extract text from images using Tesseract.js
- **Smart Chunking**: AI-powered text chunking for optimal reading flow
- **Synchronized Highlighting**: Visual focus on current reading position
- **Keyboard Controls**: Space (play/pause), Arrow keys (skip), R (restart)

## Quick Start

The app should work out of the box in the Spark environment. If you encounter the error:

```
ENOENT: no such file or directory, open '.../node_modules/@vitejs/plugin-react-swc/refresh-runtime.js'
```

**This is a Vite cache issue.** The fix is to clear Vite's dependency cache:

### Fix for SWC/React Plugin Error

1. Stop the dev server if running
2. Delete the Vite cache directory:
   ```bash
   rm -rf node_modules/.vite
   ```
3. Restart the dev server

The error occurs when Vite's pre-bundling cache has a stale reference to the SWC variant of the React plugin. This project uses `@vitejs/plugin-react` (not the SWC version), and clearing the cache forces Vite to rebuild with the correct dependencies.

## Architecture

- **React + TypeScript**: UI built with shadcn components
- **Tesseract.js**: Browser-based OCR
- **OpenAI API**: Smart text chunking for optimal reading
- **Tailwind CSS**: Styling with custom theme

## Project Structure

```
src/
├── App.tsx              # Main application component
├── components/          # React components
│   └── ui/             # shadcn UI components
├── lib/
│   ├── ocr-service.ts  # OCR functionality
│   ├── text-parser.ts  # Text chunking logic
│   └── utils.ts        # Utility functions
└── styles/             # CSS and theming
```

## Troubleshooting

### Vite Module Resolution Errors

If you see errors about missing Vite modules or plugins:

1. Clear the Vite cache: `rm -rf node_modules/.vite`
2. Clear npm cache: `npm cache clean --force`  
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Restart the dev server

### OCR Not Working

Make sure you're uploading a clear image with readable text. The OCR confidence score will show in the toast notification after processing.

### TypeScript Errors in UI Components

The shadcn UI components may show TypeScript warnings about lucide-react imports or recharts types. These are non-critical type warnings and don't affect runtime functionality.

## License

MIT License - see LICENSE file for details.
