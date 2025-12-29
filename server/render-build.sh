#!/usr/bin/env bash
# exit on error
set -o errexit

echo "Current directory: $(pwd)"

echo "Installing client dependencies..."
cd ../client
npm install

echo "Building client..."
npm run build

echo "Moving back to server..."
cd ../server

echo "Installing server dependencies..."
npm install

echo "Debug: Listing .bin directory..."
ls -la node_modules/.bin

echo "Generating Prisma client..."
node node_modules/prisma/build/index.js generate

echo "Build done!"
