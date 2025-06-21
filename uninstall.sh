#!/bin/bash

# Transparent Inactive Windows Extension - Uninstall Script
# This script removes the extension for the current user

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
SCHEMA_FILE="org.gnome.shell.extensions.semi-transparent-inactive-windows.gschema.xml"

echo -e "${GREEN}Uninstalling $EXTENSION_NAME...${NC}"

# Check if extension is installed
if [ ! -d "$EXTENSION_DIR" ]; then
    echo -e "${YELLOW}Extension is not installed or already removed.${NC}"
    exit 0
fi

# Try to disable the extension first
echo "Disabling extension..."
if command -v gnome-extensions &> /dev/null; then
    if gnome-extensions list --enabled | grep -q "$EXTENSION_UUID"; then
        gnome-extensions disable "$EXTENSION_UUID" || echo -e "${YELLOW}Could not disable extension automatically${NC}"
    else
        echo "Extension is already disabled or not active"
    fi
else
    echo -e "${YELLOW}gnome-extensions command not available, skipping disable step${NC}"
fi

# Remove extension directory
echo "Removing extension files..."
rm -rf "$EXTENSION_DIR"

# Remove schema file from user schemas directory
if [ -f "$SCHEMA_DIR/$SCHEMA_FILE" ]; then
    echo "Removing schema file..."
    rm -f "$SCHEMA_DIR/$SCHEMA_FILE"
    
    # Recompile schemas if glib-compile-schemas is available
    if command -v glib-compile-schemas &> /dev/null; then
        echo "Recompiling schemas..."
        glib-compile-schemas "$SCHEMA_DIR"
    else
        echo -e "${YELLOW}glib-compile-schemas not available, schema cache not updated${NC}"
    fi
else
    echo "Schema file not found in user directory"
fi

echo -e "${GREEN}Extension uninstalled successfully!${NC}"
echo
echo -e "${YELLOW}Note: You may need to restart GNOME Shell (Alt+F2, type 'r', press Enter)${NC}"
echo -e "${YELLOW}      or log out and log back in for changes to take full effect.${NC}" 