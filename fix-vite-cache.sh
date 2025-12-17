#!/bin/bash

# Fix for Vite SWC/React plugin cache error
# This script clears Vite's dependency pre-bundling cache

echo "🔧 Fixing Vite cache issue..."
echo ""

if [ -d "node_modules/.vite" ]; then
  echo "📦 Found Vite cache directory, removing..."
  rm -rf node_modules/.vite
  echo "✅ Vite cache cleared"
else
  echo "ℹ️  No Vite cache directory found"
fi

if [ -d ".vite" ]; then
  echo "📦 Found .vite directory, removing..."
  rm -rf .vite
  echo "✅ .vite directory cleared"
fi

echo ""
echo "✨ Cache cleared! You can now restart your dev server."
echo ""
echo "Run: npm run dev"
