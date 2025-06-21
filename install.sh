#!/bin/bash

# Transparent Inactive Windows Extension - Install Script
# This script installs the extension for the current user

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Extension details
EXTENSION_UUID="transparent-inactive-windows@art-was-here"
EXTENSION_NAME="Transparent Inactive Windows"

# Directories
EXTENSIONS_DIR="$HOME/.local/share/gnome-shell/extensions"
EXTENSION_DIR="$EXTENSIONS_DIR/$EXTENSION_UUID"
SCHEMA_DIR="$HOME/.local/share/glib-2.0/schemas"

echo -e "${GREEN}Installing $EXTENSION_NAME...${NC}"

# Check if GNOME Shell is installed
if ! command -v gnome-shell &> /dev/null; then
    echo -e "${RED}Error: GNOME Shell is not installed or not in PATH${NC}"
    exit 1
fi

# Check if glib-compile-schemas is available
if ! command -v glib-compile-schemas &> /dev/null; then
    echo -e "${RED}Error: glib-compile-schemas is not available. Please install glib2-devel or libglib2.0-dev${NC}"
    exit 1
fi

# Create extensions directory if it doesn't exist
mkdir -p "$EXTENSIONS_DIR"

# Remove existing installation if present
if [ -d "$EXTENSION_DIR" ]; then
    echo -e "${YELLOW}Removing existing installation...${NC}"
    rm -rf "$EXTENSION_DIR"
fi

# Create extension directory
echo "Creating extension directory..."
mkdir -p "$EXTENSION_DIR"

# Copy extension files
echo "Copying extension files..."
cp metadata.json "$EXTENSION_DIR/"
cp extension.js "$EXTENSION_DIR/"
cp prefs.js "$EXTENSION_DIR/"

# Copy schema files
echo "Copying schema files..."
mkdir -p "$EXTENSION_DIR/schemas"
cp schemas/*.xml "$EXTENSION_DIR/schemas/"

# Install schema globally for the user
echo "Installing schema..."
mkdir -p "$SCHEMA_DIR"
cp schemas/*.xml "$SCHEMA_DIR/"

# Compile schemas
echo "Compiling schemas..."
glib-compile-schemas "$SCHEMA_DIR"
glib-compile-schemas "$EXTENSION_DIR/schemas"

# Set proper permissions
chmod -R 755 "$EXTENSION_DIR"

echo -e "${GREEN}Extension installed successfully!${NC}"
echo
echo "To enable the extension, you can either:"
echo "1. Use GNOME Extensions app"
echo "2. Run: gnome-extensions enable $EXTENSION_UUID"
echo "3. Log out and log back in, then enable via Extensions app"
echo
echo -e "${YELLOW}Note: You may need to restart GNOME Shell (Alt+F2, type 'r', press Enter)${NC}"
echo -e "${YELLOW}      or log out and log back in for the extension to be available.${NC}" 