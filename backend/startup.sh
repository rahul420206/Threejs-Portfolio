#!/bin/bash
echo "=== Starting deployment ==="
cd /home/site/wwwroot

echo "=== Installing production dependencies ==="
npm install --production --prefer-offline 2>&1

echo "=== Starting Node.js app ==="
node dist/server.js 2>&1
