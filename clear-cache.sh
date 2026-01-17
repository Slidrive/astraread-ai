#!/bin/bash

echo "🔧 Clearing Vite cache..."

# Remove node_modules/.vite
if [ -d "node_modules/.vite" ]; then
  rm -rf node_modules/.vite
  echo "✅ Removed node_modules/.vite"
fi

# Remove .vite in root
if [ -d ".vite" ]; then
  rm -rf .vite
  echo "✅ Removed .vite"
fi

# Remove dist if exists
if [ -d "dist" ]; then
  rm -rf dist
  echo "✅ Removed dist"
fi

echo "✨ Cache cleared successfully!"
echo ""
echo "Now restart your dev server with: npm run dev"
