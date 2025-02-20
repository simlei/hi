#!/bin/bash
set -e

# GitHub Pages Setup Instructions:
# 1. Go to repository Settings > Pages
# 2. Source: Deploy from a branch
# 3. Branch: gh-pages / root
# 4. Save
# 5. Wait for first deployment to complete
#
# First-time setup:
# 1. Create repository: <username>.github.io
# 2. git remote add origin git@github.com:<username>/<username>.github.io.git
# 3. Generate SSH key if needed: ssh-keygen -t ed25519 -C "your_email@example.com"
# 4. Add key to GitHub: Settings > SSH and GPG keys
# 5. Run this script

# Cleanup function
cleanup() {
    echo "🧹 Cleaning up..."
    rm -rf node_modules .next out
}

# Ensure cleanup on script exit
trap cleanup EXIT

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run tests
echo "🧪 Running tests..."
npm run test:build || { echo "❌ Tests failed"; exit 1; }

# Build the site
echo "🏗️ Building site..."
npm run build || { echo "❌ Build failed"; exit 1; }

# Create and switch to gh-pages branch
echo "🔄 Preparing gh-pages branch..."
git checkout -B gh-pages

# Move build output to root and clean up
echo "📦 Preparing files..."
cp -r out/* .
rm -rf out

# Add and commit
echo "💾 Committing changes..."
git add .
git commit -m "Deploy to GitHub Pages" || true

# Push to gh-pages branch
echo "⬆️ Pushing to GitHub..."
git push -f origin gh-pages

# Switch back to main branch
git checkout main

echo "✨ Deployment complete!"
echo "🌐 Site will be available at: https://<username>.github.io"
echo "⏳ Allow a few minutes for GitHub Pages to update"