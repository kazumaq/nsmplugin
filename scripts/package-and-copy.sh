#!/bin/bash

# This script assumes the following:
# 1. It's being run from the 'scripts' subdirectory in your project.
# 2. Your project source code resides at '~/src/nsmplugin/'.
# 3. You have npm, vsce, and webpack installed and available in your path.
# 4. You're running this script on MacOS.
# 5. Your VS Code is installed in the default location.

# Define the path to your extension's source code and VS Code extensions directory
EXTENSION_DIR=~/src/nsmplugin
VSCODE_EXTENSIONS_DIR="~/Library/Application Support/Code/User/extensions"

# Change to your extension directory
echo "Changing to directory: $EXTENSION_DIR"
cd $EXTENSION_DIR

# Check if npm, vsce, and webpack are installed and available in your path
command -v npm >/dev/null 2>&1 || { echo >&2 "npm is required but it's not installed.  Aborting."; exit 1; }
command -v vsce >/dev/null 2>&1 || { echo >&2 "vsce is required but it's not installed.  Aborting."; exit 1; }
command -v webpack >/dev/null 2>&1 || { echo >&2 "webpack is required but it's not installed.  Aborting."; exit 1; }
echo "Confirmed npm, vsce, and webpack are installed."

# If a dist directory exists (from previous builds), clean it up
if [ -d "dist" ]; then
    echo "Removing existing dist directory."
    rm -r dist
fi

# Compile TypeScript to JavaScript and bundle your code using webpack
echo "Compiling TypeScript to JavaScript and running webpack to bundle JavaScript."
npm run compile

# Package your extension into a .vsix file using vsce
echo "Packaging extension into .vsix file."
vsce package

# Determine the most recently generated .vsix file
vsix_file=$(ls -t *.vsix | head -1)

echo "Copying $vsix_file to $VSCODE_EXTENSIONS_DIR."
cp $vsix_file "$VSCODE_EXTENSIONS_DIR"

echo "Successfully copied $vsix_file to $VSCODE_EXTENSIONS_DIR."

echo "To install the new extension, open VS Code, go to the Extensions view, \
click on the More Actions (...) menu, select 'Install from VSIX...', \
navigate to $VSCODE_EXTENSIONS_DIR, and select the .vsix file."
