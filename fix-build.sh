#!/bin/bash

echo "🔧 Fixing Vite build issues..."

# Step 1: Clear all Vite caches
echo "Step 1: Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist

# Step 2: Clear TypeScript build info
echo "Step 2: Clearing TypeScript cache..."
rm -rf tsconfig.tsbuildinfo

# Step 3: Reinstall @vitejs/plugin-react specifically
echo "Step 3: Reinstalling Vite React plugin..."
npm uninstall @vitejs/plugin-react 2>/dev/null
npm install @vitejs/plugin-react@5.1.2 --save-dev

echo "✅ Build environment repaired!"
echo ""
echo "You can now run: npm run dev"
