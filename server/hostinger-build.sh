#!/usr/bin/env bash
# Hostinger Cloud Deployment Build Script
# exit on error
set -o errexit

echo "=== Hostinger Cloud Build Script ==="
echo "Current directory: $(pwd)"

echo ""
echo "Step 1: Installing client dependencies..."
cd ../client
npm install

echo ""
echo "Step 2: Building client for production..."
npm run build

echo ""
echo "Step 3: Moving back to server..."
cd ../server

echo ""
echo "Step 4: Installing server dependencies..."
npm install

echo ""
echo "Step 5: Generating Prisma client (MySQL)..."
npx prisma generate

echo ""
echo "Step 6: Pushing schema to database..."
npx prisma db push --accept-data-loss

echo ""
echo "=== Build Complete! ==="
echo "You can now start the server with: npm start"
