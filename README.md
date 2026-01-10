# LearningTheForce AI Reader

A sophisticated speed reading application that uses intelligent text chunking and adaptive pacing to maximize comprehension while maintaining high reading speeds.

## Features

### Core Reading Features
- **Variable Speed Reading**: Adjustable reading speed from 200-1000 WPM with preset options (300, 500, 700)
- **Smart Text Chunking**: AI-powered text parsing that groups words into meaningful phrases for better comprehension
- **Animated Focus Words**: Smooth animations with glowing effects highlight the current focus word
- **Progress Tracking**: Real-time progress bar with percentage and estimated time remaining
- **Keyboard Controls**: Space (play/pause), Arrow keys (skip), R (restart)

### Advanced Features
- **OCR Support**: Extract text from images using Tesseract.js with confidence scoring
- **OCR Quality Assurance**: Low confidence detection with editable text review before reading
- **Tabbed Input Interface**: Separate tabs for text input and image upload
- **Toast Notifications**: Rich feedback with success, error, and warning messages
- **Estimated Reading Time**: Calculates reading time based on word count and selected WPM
- **Modern UI**: Built with shadcn/ui components for a polished, professional interface

### Smart Edge Case Handling
- **Minimum Word Count Validation**: Ensures text has at least 10 words
- **Large Text Warning**: Alerts users when processing very long documents (>100,000 words)
- **OCR Confidence Threshold**: Warns and allows text editing when OCR confidence is below 60%
- **Responsive Design**: Optimized for desktop and mobile with proper touch targets

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Installation

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

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## Technology Stack

- **Frontend Framework**: React 18 + TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom animations
- **Build Tool**: Vite
- **OCR Engine**: Tesseract.js
- **Notifications**: Sonner
- **Text Processing**: Custom AI-powered chunking algorithm

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause reading |
| `←` (Left Arrow) | Skip backward 10 chunks |
| `→` (Right Arrow) | Skip forward 10 chunks |
| `R` | Restart from beginning |

## Usage

### Text Input
1. Click on the **Text Input** tab in the dialog
2. Paste your text or click **Load Sample Text** to try it out
3. Click **Start Reading** to begin
4. Use keyboard shortcuts or on-screen controls to navigate

### Image Upload (OCR)
1. Click on the **Image Upload** tab
2. Upload an image containing text
3. Wait for OCR processing (progress bar shows status)
4. If confidence is high (≥60%), reading starts automatically
5. If confidence is low (<60%), review and edit the extracted text before starting

### Reading Controls
- Adjust reading speed using the slider or preset WPM buttons
- Track your progress with the progress bar
- View estimated time remaining
- Skip forward/backward through chunks
- Restart at any time

## Project Structure

```
astraread-ai/
├── src/
│   ├── App.tsx              # Main application component
│   ├── components/
│   │   └── ui/              # shadcn UI components
│   │       ├── button.tsx
│   │       ├── dialog.tsx
│   │       ├── slider.tsx
│   │       ├── progress.tsx
│   │       ├── textarea.tsx
│   │       ├── card.tsx
│   │       ├── tabs.tsx
│   │       └── alert.tsx
│   ├── lib/
│   │   ├── ocr-service.ts   # OCR functionality with Tesseract.js
│   │   ├── text-parser.ts   # AI-powered text chunking
│   │   └── utils.ts         # Utility functions
│   ├── main.css             # Global styles and animations
│   ├── index.css            # Tailwind and theme configuration
│   └── main.tsx             # Application entry point
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Development Best Practices

### Code Style
- TypeScript strict mode enabled
- Functional components with React hooks
- Proper type annotations for all props and state
- Constants extracted for magic numbers

### UI/UX Principles
- Mobile-first responsive design
- Minimum 44px touch targets for mobile
- Toast notifications instead of browser alerts
- Smooth animations for better user experience
- Accessible components with ARIA labels

### Performance
- Lazy loading for heavy dependencies (Tesseract.js)
- Optimized text chunking algorithm
- Efficient state management
- Production build optimization with Vite

## Troubleshooting

### Build Errors

If you encounter build errors related to Tailwind CSS or PostCSS:
1. Clear the Vite cache: `rm -rf node_modules/.vite`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Rebuild: `npm run build`

### Vite Module Resolution Errors

If you see errors about missing Vite modules or plugins:
1. Clear the Vite cache: `rm -rf node_modules/.vite`
2. Clear npm cache: `npm cache clean --force`  
3. Reinstall dependencies: `rm -rf node_modules && npm install`
4. Restart the dev server

### OCR Not Working

- Ensure you're uploading a clear image with readable text
- The OCR confidence score will show in the toast notification
- Low confidence (<60%) will allow you to review and edit text before reading
- Supported image formats: PNG, JPEG, WebP

### TypeScript Errors

The shadcn UI components may show TypeScript warnings about imports. These are non-critical type warnings and don't affect runtime functionality.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details.
