# LearningTheForce AI Reader

A sophisticated speed reading application that uses intelligent text chunking and adaptive pacing to maximize comprehension while maintaining high reading speeds.

## 🚀 Features

### Core Reading Features
- **Text Input & Management** - Paste text, upload images with OCR support
- **Intelligent Word Chunking** - Groups words into semantic chunks for better comprehension
- **Adaptive Speed Reader** - Display text chunks sequentially at customizable WPM (200-1000)
- **Dynamic Speed Control** - Real-time speed adjustment with preset options (300/500/700 WPM)
- **Playback Controls** - Play, pause, restart, skip forward/backward
- **Progress Tracking** - Visual progress bar with estimated time remaining

### Advanced Features
- **OCR Support** - Extract text from images using Tesseract.js
- **OCR Confidence Display** - Shows confidence level and warns on low accuracy
- **Text Review** - Edit extracted text before reading
- **Toast Notifications** - User-friendly feedback for all actions
- **Keyboard Shortcuts** - Space (play/pause), ← / → (skip), R (restart)
- **Responsive Design** - Optimized for desktop and mobile devices

### Smart Edge Case Handling
- Minimum text length validation (10 words)
- Warning for very long text (100k+ words)
- OCR confidence warnings (<60% accuracy)
- Estimated reading time calculations
- Focus word animations for better reading flow

## 🎯 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

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

## 🎨 Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **Tesseract.js** - OCR engine
- **Sonner** - Toast notifications
- **Radix UI** - Accessible components

## ⌨️ Keyboard Shortcuts

- **Space** - Play/Pause reading
- **←** - Skip backward (10 chunks)
- **→** - Skip forward (10 chunks)
- **R** - Restart from beginning

## 📖 Usage

1. Click "Start a New Reading Session"
2. Choose either:
   - **Text Input** - Paste or type your text
   - **Image Upload** - Upload an image with text for OCR extraction
3. Adjust reading speed (200-1000 WPM)
4. Press Play or Space to start reading
5. Use controls or keyboard shortcuts to navigate

## 🔧 Development

The project follows best practices for React + TypeScript development:
- Component-based architecture
- Type-safe code with TypeScript
- Reusable UI components from shadcn/ui
- Responsive design with Tailwind CSS
- Accessible components using Radix UI primitives

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.
