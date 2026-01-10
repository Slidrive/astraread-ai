# LearningTheForce AI Reader

A modern, AI-powered speed reading application with advanced OCR support, intelligent text chunking, and smooth animations. Built with React, TypeScript, and shadcn/ui components.

## Features

### Core Reading Features
- **Variable Speed Reading**: Adjustable reading speed from 200-1000 WPM
- **Smart Text Chunking**: AI-powered phrase chunking for optimal reading flow
- **Visual Focus Highlighting**: Animated focus on key words with smooth transitions
- **Progress Tracking**: Real-time progress bar with completion percentage and time remaining
- **Keyboard Controls**: Full keyboard support for efficient navigation

### Advanced Features
- **OCR Text Extraction**: Extract text from images using Tesseract.js
- **OCR Confidence Tracking**: Display confidence scores and warnings for low-quality extractions
- **Editable OCR Output**: Review and edit extracted text before starting
- **Tabbed Input Interface**: Separate tabs for text input and image upload
- **Toast Notifications**: Professional feedback using Sonner
- **Estimated Reading Time**: Calculate and display expected reading duration
- **Responsive Design**: Optimized for desktop and mobile devices

### Smart Edge Case Handling
- Minimum word count validation (10 words)
- Large text warnings (100,000+ words)
- Low OCR confidence alerts (< 60%)
- Manual review option for low-confidence extractions
- Smooth animations and transitions for better UX

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **shadcn/ui** - Modern UI component library
- **Radix UI** - Headless UI primitives
- **Tailwind CSS** - Utility-first styling
- **Tesseract.js** - Browser-based OCR
- **Sonner** - Toast notifications
- **Lucide React** - Icon library

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause reading |
| `←` | Skip backward (10 chunks) |
| `→` | Skip forward (10 chunks) |
| `R` | Restart from beginning |

## Usage

### Text Input
1. Click "Start a New Reading Session" or use the "New Text" button
2. Select the "Text Input" tab
3. Paste your text or click "Load Sample Text"
4. Click "Start Reading" to begin
5. Use spacebar to play/pause, arrow keys to navigate

### Image Upload
1. Click "Start a New Reading Session"
2. Select the "Image Upload" tab
3. Upload an image containing text
4. Wait for OCR processing to complete
5. Review the extracted text and confidence score
6. Edit if needed, then click "Start Reading"

### Speed Control
- Use the slider to adjust reading speed (200-1000 WPM)
- Click preset buttons for quick speed selection (300, 500, 700 WPM)
- Real-time preview shows estimated reading time

## Development Best Practices

- **Type Safety**: All components use TypeScript for compile-time safety
- **Component Reusability**: shadcn/ui components for consistent design
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized animations and smooth transitions
- **Error Handling**: Comprehensive validation and user feedback
- **Mobile-First**: Responsive design with proper touch targets

## Troubleshooting

### Vite Cache Issues
If you see module resolution errors:
```bash
rm -rf node_modules/.vite
npm run dev
```

### OCR Not Working
- Ensure image has clear, readable text
- Check OCR confidence score in the toast notification
- Try editing the extracted text if confidence is low

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## License

MIT License - see LICENSE file for details.
