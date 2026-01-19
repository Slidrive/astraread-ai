#!/bin/bash

echo "🔧 COMPREHENSIVE VITE BUILD FIX"
echo "================================"
echo ""

# Step 1: Clear all caches
echo "Step 1: Clearing all Vite and TypeScript caches..."
rm -rf node_modules/.vite
rm -rf .vite
rm -rf dist
rm -rf tsconfig.tsbuildinfo
echo "✅ Caches cleared"
echo ""

# Step 2: Fix React dependencies (they should be in dependencies, not devDependencies)
echo "Step 2: Moving React to dependencies..."
npm install react@19.2.3 react-dom@19.2.3 --save
echo "✅ React dependencies fixed"
echo ""

# Step 3: Reinstall Vite plugin
echo "Step 3: Reinstalling Vite React plugin..."
npm install @vitejs/plugin-react@5.1.2 --save-dev
echo "✅ Vite plugin reinstalled"
echo ""

echo "🎉 Build environment repaired!"
echo ""
echo "Now run: npm run dev -- --force"
echo ""
echo "The --force flag tells Vite to ignore any cached data and rebuild everything."
