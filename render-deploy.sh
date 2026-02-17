#!/bin/bash
# render-deploy.sh - build & start script for Render.com
# usage: this script is used as the "Start Command" in Render's service settings.
# It installs dependencies, builds the React client, then launches the Node server.

set -euo pipefail

# navigate to repository root (Render defaults to repo root anyway)
cd "$(dirname "$0")"

# install backend deps
echo "Installing backend dependencies..."
npm install

# install frontend deps and build
echo "Installing client dependencies and building..."
npm --prefix client install
npm --prefix client run build

# export optional vars if not already set
: "${PORT:=5000}"
: "${MONGODB_URI:=}"
: "${JWT_SECRET:=change-this-secret}"

# start the server
echo "Starting server on port $PORT"
npm start
