# LearningTheForce AI Reader

An AI-powered speed reading application with OCR support, intelligent text chunking, and synchronized highlighting.

## Features

### Core Reading Features
- **Variable Speed Reading**: Adjustable reading speed from 200-1000 WPM with smooth slider control
- **Smart Text Chunking**: Intelligent phrase grouping for optimal reading flow
- **Focus Word Highlighting**: Animated pulse-glow effect on the current focus word
- **Playback Controls**: Play, pause, skip forward/backward, and restart functionality
- **Progress Tracking**: Real-time progress bar with estimated reading time

### Advanced Features
- **OCR Support**: Extract text from images using Tesseract.js
- **OCR Confidence Display**: Shows extraction confidence percentage
- **Low Confidence Warnings**: Alerts user when OCR confidence is below 60%
- **Text Review**: Allows editing of extracted text before reading
- **Tabbed Interface**: Separate tabs for text input vs image upload
- **Keyboard Shortcuts**: Space (play/pause), Arrow keys (skip), R (restart)

### Smart Edge Case Handling
- **Minimum Word Count**: Validates at least 10 words before parsing
- **Large Text Warning**: Alerts for texts exceeding 100,000 words
- **Estimated Reading Time**: Calculates and displays reading duration at current WPM
- **Toast Notifications**: User-friendly notifications replacing browser alerts

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Slidrive/astraread-ai.git
   cd astraread-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## Technology Stack

- **React + TypeScript**: Modern UI framework with type safety
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React component library
- **Tesseract.js**: Browser-based OCR engine
- **Sonner**: Beautiful toast notifications

## Keyboard Shortcuts

- **Space**: Play/Pause reading
- **← (Left Arrow)**: Skip backward 10 chunks
- **→ (Right Arrow)**: Skip forward 10 chunks
- **R**: Restart from beginning

## Usage

1. **Text Input**: Paste text directly or click "Load Sample Text" for a demo
2. **Image Upload**: Upload an image containing text to extract via OCR
3. **Adjust Speed**: Use the slider or preset buttons (300/500/700 WPM)
4. **Start Reading**: Click "Start Reading" or use keyboard shortcuts
5. **Track Progress**: Monitor reading progress with the visual progress bar

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
