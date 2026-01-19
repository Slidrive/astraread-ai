# Planning Guide

A sophisticated speed reading application that uses intelligent text chunking and adaptive pacing to maximize comprehension while maintaining high reading speeds.

**Experience Qualities**: 
1. **Focused** - The interface should eliminate all distractions, creating a zen-like environment where the reader can achieve flow state
2. **Intelligent** - The app should adapt to natural language patterns, grouping words semantically rather than mechanically
3. **Empowering** - Users should feel in complete control of their reading experience with intuitive, responsive controls

**Complexity Level**: Light Application (multiple features with basic state)
  - The app needs to handle text input, parsing, playback controls, and user preferences, but doesn't require accounts or server-side processing

## Essential Features

### Text Input & Management
- **Functionality**: Accept and parse text input from paste, manual entry, or image upload with OCR
- **Purpose**: Provide flexible ways to load reading material from various sources
- **Trigger**: User clicks input area, pastes text, or uploads an image
- **Progression**: Empty state → Click/paste/upload → Text appears in input area or image is processed via OCR → Parse button becomes active → Click parse → Reading view loads
- **Success criteria**: App handles plain text up to 50,000 words, preserves paragraph breaks, handles various text encodings, successfully extracts text from images with confidence reporting

### AI-Powered Study Tools ✨ NEW
- **Functionality**: Generate summaries, explanations, flashcards, and quizzes from reading content using AI
- **Purpose**: Transform passive reading into active learning with AI-generated study materials
- **Trigger**: User clicks "Show AI Tools" button after loading text
- **Progression**: Click Show Tools → AI panel appears → Select tool (Summarize/Explain/Flashcards/Quiz) → AI processes text → Results displayed → User can review/study generated content
- **Success criteria**: AI successfully generates relevant summaries, clear explanations, useful flashcards with Q&A pairs, and comprehensive quizzes with multiple choice questions

### Bookmark & Annotation System ✨ NEW
- **Functionality**: Save specific locations in the reading material with optional notes
- **Purpose**: Mark important sections for later review and add personal annotations
- **Trigger**: User clicks "Bookmarks" button, then "Add Bookmark" while reading
- **Progression**: Click Bookmarks → View saved bookmarks → Add Bookmark → Optional note → Save → Jump to bookmark from list
- **Success criteria**: Bookmarks persist between sessions, notes are saved correctly, clicking bookmark jumps to exact position

### Reading Goals & Streak Tracking ✨ NEW
- **Functionality**: Set daily word count targets and track reading streaks
- **Purpose**: Gamify reading habits and motivate consistent daily practice
- **Trigger**: User clicks "Goals" button
- **Progression**: View current goal → See streak counter → Check progress → Edit daily target → Track total words read
- **Success criteria**: Daily streak increments when goal met, resets if day missed, shows longest streak and total words

### Text-to-Speech Integration ✨ NEW
- **Functionality**: Convert reading text to audio with voice customization options
- **Purpose**: Enable multitasking and provide alternative content consumption method
- **Trigger**: User clicks "TTS" button
- **Progression**: Enable TTS → Select voice → Adjust rate/pitch/volume → Play/Pause → Auto-advance through text
- **Success criteria**: Text speaks clearly, follows reading progress, voice settings persist, works across all browsers

### Vocabulary Analysis ✨ NEW
- **Functionality**: AI-powered analysis of reading material to identify and define difficult or interesting words
- **Purpose**: Enhance vocabulary learning and comprehension by highlighting advanced terms with definitions and examples
- **Trigger**: User clicks "Vocab" button after loading text
- **Progression**: Click Vocab → AI analyzes text → List of 8-12 words displayed with definitions → Click word to see example sentences → Review and learn new vocabulary
- **Success criteria**: AI identifies relevant vocabulary words, provides accurate definitions, includes contextual examples, words are categorized by difficulty level

### Reading History Calendar ✨ NEW
- **Functionality**: Visual calendar showing reading activity over the past 6 weeks with statistics
- **Purpose**: Track reading progress and maintain motivation through visual feedback
- **Trigger**: User clicks "History" button
- **Progression**: Click History → Calendar displays with color-coded intensity → Hover for daily details → View total words, documents read, and average WPM → Review recent sessions list
- **Success criteria**: Calendar accurately tracks daily reading sessions, displays intensity based on word count, persists data between sessions, shows meaningful statistics

### Focus Mode ✨ NEW
- **Functionality**: Fullscreen distraction-free reading interface with minimal controls
- **Purpose**: Maximize concentration and eliminate distractions during reading sessions
- **Trigger**: User clicks "Focus" button while reading
- **Progression**: Click Focus → Enters fullscreen → Large text display with minimal UI → Control bar at bottom → Keyboard shortcuts active → Press Esc or click X to exit
- **Success criteria**: Smooth transition to fullscreen, maintains reading position, keyboard shortcuts work reliably, easy to exit, syncs progress with main view

### Intelligent Word Chunking
- **Functionality**: Group words into semantic chunks (1-3 words) based on natural language patterns
- **Purpose**: Improve comprehension by presenting phrases rather than individual words
- **Trigger**: Automatic during text parsing
- **Progression**: Raw text → NLP analysis → Identify phrases/clauses → Create chunks with optimal grouping → Store sequence
- **Success criteria**: Chunks respect grammar, average 1.8 words per chunk, never break mid-phrase

### Adaptive Speed Reader
- **Functionality**: Display text chunks sequentially at user-defined WPM with focus indicators
- **Purpose**: Enable high-speed reading while maintaining comprehension
- **Trigger**: User clicks play button
- **Progression**: Idle → Play → Display chunks with timing → Highlight focus word → Progress bar updates → Complete or pause
- **Success criteria**: Smooth 60fps rendering, accurate WPM, no stuttering, clear focus indication

### Dynamic Speed Control
- **Functionality**: Adjust reading speed in real-time with visual feedback
- **Purpose**: Allow users to find their optimal reading pace
- **Trigger**: User drags speed slider or uses keyboard shortcuts
- **Progression**: Current speed → Adjust slider → WPM updates → Reading pace changes immediately → Visual confirmation
- **Success criteria**: Range 200-1000 WPM, smooth transitions, preset options (300/500/700 WPM)

### Playback Controls
- **Functionality**: Play, pause, restart, skip forward/backward
- **Purpose**: Give users full control over reading flow
- **Trigger**: Button clicks or keyboard shortcuts
- **Progression**: Any state → Key press/click → State changes → Visual feedback → Reading continues from new position
- **Success criteria**: Keyboard shortcuts (Space=play/pause, ←/→=skip, R=restart), instant response, persistent position

### Progress Tracking
- **Functionality**: Visual progress bar showing position in text, estimated time remaining
- **Purpose**: Help users gauge their reading session and remaining content
- **Trigger**: Automatic during playback
- **Progression**: Reading starts → Progress updates in real-time → Display percentage and time → Update on skip/restart
- **Success criteria**: Accurate time estimates, smooth progress bar animation, percentage display

## Edge Case Handling
- **Empty input**: Show helpful placeholder with sample text option
- **Very short text**: Display warning if text is under 50 words, suggest minimum length
- **Very long text**: Show estimated reading time, allow chunked loading for 100k+ words
- **Special characters**: Strip or preserve formatting marks based on user preference
- **Rapid speed changes**: Debounce slider input to prevent performance issues
- **Resume from pause**: Maintain exact position, highlight current chunk on pause
- **OCR failures**: Handle images with no detectable text gracefully with error messaging
- **Low OCR confidence**: Display confidence percentage, allow user to review/edit extracted text
- **Large images**: Process images efficiently without blocking UI, show progress indicator
- **Bookmark at end**: Prevent bookmarking beyond last chunk
- **Missed streak days**: Reset streak to 0 if a day is missed, preserve longest streak
- **Goal updates mid-day**: Recalculate progress when daily target changes
- **TTS browser support**: Gracefully handle browsers without Speech Synthesis API
- **No voices available**: Show helpful error if no TTS voices found

## Design Direction
The design should feel focused and meditative—like a precision instrument for the mind. It should embrace minimalism with purposeful moments of clarity, using generous negative space and deliberate typography to create a distraction-free reading sanctuary. The interface should be serious and elegant, fading into the background during reading while providing confident, immediate control when needed.

## Color Selection
Complementary color scheme to create visual tension that keeps readers alert without strain

- **Primary Color**: Deep indigo (oklch(0.35 0.15 270)) - Communicates focus, intelligence, and calm concentration
- **Secondary Colors**: Warm cream background (oklch(0.96 0.01 85)) for reduced eye strain during extended reading; soft slate (oklch(0.65 0.02 250)) for secondary UI elements
- **Accent Color**: Vibrant coral (oklch(0.70 0.19 25)) - Commands attention for active reading focus and interactive controls
- **Foreground/Background Pairings**:
  - Background (Warm Cream oklch(0.96 0.01 85)): Dark charcoal text (oklch(0.25 0.01 270)) - Ratio 11.2:1 ✓
  - Card (White oklch(0.99 0 0)): Primary indigo (oklch(0.35 0.15 270)) - Ratio 8.1:1 ✓
  - Primary (Deep Indigo oklch(0.35 0.15 270)): White text (oklch(0.99 0 0)) - Ratio 8.1:1 ✓
  - Secondary (Soft Slate oklch(0.65 0.02 250)): Dark charcoal (oklch(0.25 0.01 270)) - Ratio 4.6:1 ✓
  - Accent (Vibrant Coral oklch(0.70 0.19 25)): Dark charcoal (oklch(0.25 0.01 270)) - Ratio 5.2:1 ✓
  - Muted (Light Gray oklch(0.92 0.005 250)): Slate text (oklch(0.50 0.02 250)) - Ratio 5.8:1 ✓

## Font Selection
Typography should convey precision and clarity while remaining supremely readable at various speeds and sizes

- **Typographic Hierarchy**:
  - Reading Display (Main): Inter Bold / 48px / tight tracking (-0.02em) / 1.1 line height - Maximum clarity for rapid reading
  - Reading Display (Secondary words): Inter Regular / 36px / normal tracking / 1.1 line height - Contextual support
  - Controls & Labels: Inter Medium / 14px / normal tracking / 1.4 line height - Clear UI communication
  - Stats & Metadata: Inter Regular / 12px / wide tracking (0.02em) / 1.5 line height - Readable secondary info
  - Input Text: Inter Regular / 16px / normal tracking / 1.6 line height - Comfortable editing

## Animations
Animations should be purposeful and subtle—reinforcing focus rather than breaking it. Movement should feel precise and mechanical, like the operation of a high-quality timepiece.

- **Purposeful Meaning**: Smooth transitions between chunks convey the flow of reading; pulsing on the focus word draws the eye naturally; control animations confirm user actions with precision
- **Hierarchy of Movement**: 
  1. Focus word transition (most important) - 80ms fade with slight scale
  2. Chunk display - 120ms fade-in for context words
  3. Progress bar - smooth 16ms updates for continuous feedback
  4. Control interactions - 150ms for hover/press states
  5. Modal appearances - 200ms slide-up for settings/input

## Component Selection
- **Components**: 
  - Dialog for initial text input and settings
  - Tabs for switching between text input and image upload
  - Slider for speed control with custom styling for precise control
  - Button for all playback controls (play/pause/restart/skip) with distinct states
  - Progress for reading position indicator and OCR processing
  - Card for control panel with subtle elevation
  - Textarea for text input with adequate padding
  - Label for all form elements with clear hierarchy
  - File input for image upload with drag-and-drop support
  
- **Customizations**: 
  - Custom reading display component with focus word highlighting
  - Custom keyboard shortcut handler with visual feedback
  - Custom chunk parser using LLM for intelligent grouping
  - Custom speed presets component (quick WPM selection)
  - Custom OCR processing with progress feedback and confidence reporting
  
- **States**: 
  - Buttons: Subtle shadow on default, bright accent on hover, scale down on press, muted when disabled
  - Slider: Smooth drag with real-time WPM display, accent color for track fill
  - Reading display: Pulsing glow on focus word, dimmed context words, smooth transitions
  
- **Icon Selection**: 
  - Play (phosphor-icons) for start
  - Pause for pause state
  - ArrowCounterClockwise for restart
  - ArrowLeft/ArrowRight for skip
  - UploadSimple for file input
  - Image for image upload tab
  - TextAa for text input tab
  
- **Spacing**: 
  - Generous padding around reading display (p-16)
  - Control panel with balanced spacing (p-6)
  - Button groups with gap-3
  - Card margins (mb-8) for clear separation
  
- **Mobile**: 
  - Larger touch targets (min 48px) for controls
  - Responsive font sizes (36px on mobile, 48px on desktop for reading)
  - Stack controls vertically on mobile
  - Collapsible settings panel
  - Full-screen reading mode on mobile for maximum focus
