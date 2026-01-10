# LearningTheForce AI Reader

A modern, AI-powered speed reading application with OCR support, intelligent text chunking, and a polished user interface built with React and shadcn/ui.

## Features

### Core Reading Features
- **Variable Speed Reading**: Adjustable reading speed from 200 to 1000 words per minute
- **Smart Text Chunking**: AI-powered text chunking for optimal reading flow and comprehension
- **Focus Word Highlighting**: Visual emphasis on the focus word in each phrase with smooth animations
- **Real-time Progress Tracking**: Visual progress bar showing reading completion and estimated time remaining

### Text Input Options
- **Manual Text Input**: Paste or type text directly into the application
- **OCR Image Upload**: Extract text from images using Tesseract.js
- **Sample Text**: Quick-start with pre-loaded sample text
- **Text Editing**: Edit extracted OCR text before starting reading session

### OCR Capabilities
- **Confidence Tracking**: Display OCR confidence percentage with color-coded indicators
- **Low Confidence Warnings**: Automatic alerts when OCR confidence is below 60%
- **Progress Visualization**: Real-time OCR processing progress bar
- **Multi-language Support**: Configurable language support for text extraction

### User Experience
- **Tabbed Interface**: Clean separation between text input and image upload
- **Keyboard Shortcuts**: Full keyboard control for efficient navigation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Touch-Friendly**: Minimum 44px touch targets for mobile accessibility
- **Toast Notifications**: User-friendly feedback with success/error messages
- **Smooth Animations**: Polished transitions and focus word animations

## Installation

### Prerequisites
- Node.js 18+ and npm

### Setup
```bash
# Clone the repository
git clone https://github.com/Slidrive/astraread-ai.git
cd astraread-ai

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technology Stack

### Frontend Framework
- **React 18** with TypeScript
- **Vite** for fast development and optimized builds

### UI Components
- **shadcn/ui**: Modern component library built on Radix UI
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations and transitions
- **Sonner**: Beautiful toast notifications

### Core Libraries
- **Tesseract.js**: Browser-based OCR engine
- **Lucide React**: Icon library
- **Radix UI**: Accessible component primitives

## Usage

### Starting a Reading Session

1. **Text Input Method**:
   - Click "Text Input" tab
   - Paste your text or click "Load Sample Text"
   - View word count
   - Click "Start Reading"

2. **Image Upload Method**:
   - Click "Image Upload" tab
   - Upload an image containing text
   - Wait for OCR processing
   - Review extracted text and OCR confidence
   - Edit text if needed
   - Click "Start Reading"

### Reading Controls

- **Play/Pause**: Click the play button or press `Space`
- **Skip Forward**: Click skip button or press `→` (skips 10 chunks)
- **Skip Backward**: Click skip button or press `←` (skips 10 chunks)
- **Restart**: Click restart button or press `R`
- **Adjust Speed**: Use the slider or click preset WPM buttons (300, 500, 700)

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause reading |
| `←` | Skip backward 10 chunks |
| `→` | Skip forward 10 chunks |
| `R` | Restart from beginning |

## Development

### Project Structure
```
src/
├── App.tsx              # Main application component
├── components/          
│   └── ui/             # shadcn UI components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── slider.tsx
│       ├── progress.tsx
│       ├── tabs.tsx
│       └── ...
├── lib/
│   ├── ocr-service.ts  # OCR functionality with Tesseract.js
│   ├── text-parser.ts  # Text chunking logic
│   └── utils.ts        # Utility functions
├── main.css            # Global styles and animations
└── index.css           # Tailwind configuration
```

### Key Constants
- `MIN_WORD_COUNT`: 10 words (minimum text length)
- `OCR_CONFIDENCE_THRESHOLD`: 60% (minimum acceptable confidence)
- `TAB_TEXT_INPUT`: 'text' (text input tab identifier)
- `TAB_IMAGE_UPLOAD`: 'image' (image upload tab identifier)

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm run preview
```

## Troubleshooting

### Vite Module Resolution Errors
If you see errors about missing Vite modules:
1. Clear the Vite cache: `rm -rf node_modules/.vite`
2. Restart the dev server

### OCR Not Working
- Ensure you're uploading a clear image with readable text
- Check the OCR confidence score in the notification
- Try adjusting image quality or contrast

### Build Errors
If you encounter CSS or Tailwind errors:
1. Clear the build cache: `rm -rf dist`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
