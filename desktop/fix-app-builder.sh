#!/bin/bash

# Fix app-builder ENOENT error for electron-builder
# This script reinstalls app-builder-bin with correct permissions

set -e

echo "🔧 LibreChat Desktop - app-builder Fix Script"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Detect architecture
ARCH=$(uname -m)
echo -e "${BLUE}Detected architecture: $ARCH${NC}"

# Navigate to root
cd "$(dirname "$0")/.."
ROOT_DIR=$(pwd)

echo ""
echo -e "${YELLOW}Step 1: Cleaning up existing app-builder...${NC}"

# Remove app-builder-bin from root node_modules
rm -rf node_modules/app-builder-bin
echo -e "${GREEN}✓ Removed from root${NC}"

# Remove from desktop node_modules if exists
if [ -d "desktop/node_modules/app-builder-bin" ]; then
  rm -rf desktop/node_modules/app-builder-bin
  echo -e "${GREEN}✓ Removed from desktop${NC}"
fi

echo ""
echo -e "${YELLOW}Step 2: Reinstalling app-builder-bin...${NC}"

# Install at root level (where electron-builder looks)
npm install app-builder-bin@4.0.0 --save-dev --legacy-peer-deps

echo ""
echo -e "${YELLOW}Step 3: Verifying installation...${NC}"

# Check if file exists
if [ "$ARCH" = "arm64" ]; then
  APP_BUILDER_PATH="node_modules/app-builder-bin/mac/app-builder_arm64"
else
  APP_BUILDER_PATH="node_modules/app-builder-bin/mac/app-builder_x64"
fi

if [ -f "$APP_BUILDER_PATH" ]; then
  echo -e "${GREEN}✓ app-builder binary found: $APP_BUILDER_PATH${NC}"

  # Make sure it's executable
  chmod +x "$APP_BUILDER_PATH"
  echo -e "${GREEN}✓ Set executable permissions${NC}"

  # Test it
  if "$APP_BUILDER_PATH" --version &> /dev/null; then
    echo -e "${GREEN}✓ app-builder is working!${NC}"
  else
    echo -e "${YELLOW}⚠ app-builder may not be fully functional${NC}"
  fi
else
  echo -e "${RED}✗ app-builder binary not found${NC}"
  echo -e "${YELLOW}Expected location: $APP_BUILDER_PATH${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   ✅ Fix completed successfully!          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"

echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  ${BLUE}1.${NC} Run: ${GREEN}npm run desktop:build:arm64${NC}"
echo -e "  ${BLUE}2.${NC} If error persists, see: ${GREEN}desktop/TROUBLESHOOTING.md${NC}"
echo ""
