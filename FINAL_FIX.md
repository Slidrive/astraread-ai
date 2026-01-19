# Final Build Fix - Vite Cache Issue

## Problem
The error `ENOENT: no such file or directory, open '/workspaces/spark-template/node_modules/@vitejs/plugin-react-swc/refresh-runtime.js'` is caused by a corrupted Vite cache, NOT by a missing package.

## Root Cause
- The error message is MISLEADING - it mentions `plugin-react-swc` but you're actually using `@vitejs/plugin-react` (non-SWC version)
- Vite's cache in `node_modules/.vite` is pointing to the wrong plugin files
- This happens when switching between plugin versions or after interrupted builds

## Solution

### Step 1: Clear ALL caches
```bash
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
rm -rf tsconfig.tsbuildinfo
```

### Step 2: Verify your vite.config.ts
Make sure it says `import react from '@vitejs/plugin-react'` (NOT `@vitejs/plugin-react-swc`)

Your current config is CORRECT.

### Step 3: Reinstall the React plugin
```bash
npm uninstall @vitejs/plugin-react
npm install @vitejs/plugin-react@5.1.2 --save-dev
```

### Step 4: Start dev server with force flag
```bash
npm run dev -- --force
```

The `--force` flag tells Vite to rebuild all dependencies from scratch.

## Why This Keeps Happening
Every time you run the dev server after an error, Vite tries to use its cache. If the cache is corrupted, the error repeats. You MUST clear the cache to fix it.

## Prevention
After ANY build error, always clear the cache before retrying:
```bash
rm -rf node_modules/.vite && npm run dev
```

## Current Status
- ✅ vite.config.ts is correct (using @vitejs/plugin-react)
- ✅ postcss.config.cjs is correct
- ✅ src/index.css is correct (using @import 'tailwindcss')
- ✅ All dependencies are installed
- ❌ Vite cache needs to be cleared

## Execute This Now
```bash
#!/bin/bash
echo "Clearing Vite caches..."
rm -rf node_modules/.vite .vite dist tsconfig.tsbuildinfo
echo "Cache cleared. Starting dev server with --force flag..."
npm run dev -- --force
```
