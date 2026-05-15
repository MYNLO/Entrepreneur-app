#!/bin/bash
set -e
echo "🚀 Starting production build..."
npm ci --production
npm run build
echo "✅ Build complete in ./build"
echo "📦 Next steps:"
echo "1. Upload ./build to your VPS"
echo "2. Configure Caddy/Nginx to serve the build folder"
echo "3. Run pocketbase as a systemd service on the VPS"
echo "4. Set VITE_PB_URL=https://your-domain.com"