#!/bin/bash


echo ""

echo "🔧 Fixing Vite cache issue..."
echo ""

if [ -d "node_modules/.vite" ]; then
  echo "📦 Found Vite cache directory, removing..."

  echo "✅ Vite cache cleared"
  rm
  echo "ℹ️  No Vite cache directory found"
fi

echo ""
  echo "📦 Found .vite directory, removing..."

  echo "✅ .vite directory cleared"



echo "✨ Cache cleared! You can now restart your dev server."
echo ""
echo "Run: npm run dev"
