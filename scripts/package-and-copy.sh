#!/bin/bash

# This script is used to package a VS Code extension, remove an older version if it exists,
# and copy the new version to the VS Code extensions directory.

# Requirements:
# - npm, vsce, and webpack command-line tools should be installed and available in the PATH.
# - The VS Code extension project should be located in the '~/src/nsmplugin' directory.
# - The VS Code extensions directory should be '~/.vscode/extensions'.

# Notes:
# - If an older version of the extension .vsix file exists in the VS Code extensions directory, it will be removed.

extension_dir=~/src/nsmplugin
vscode_extensions_dir=~/.vscode/extensions
abort_msg="Operation failed. Aborting."

echo "Changing to directory: $extension_dir"
cd "$extension_dir" || { echo "Unable to change to directory: $extension_dir. $abort_msg"; exit 1; }

# Check for necessary command-line tools
for cmd in npm vsce webpack
do
  command -v $cmd >/dev/null 2>&1 || { echo >&2 "$cmd is required but it's not installed. $abort_msg"; exit 2; }
done
echo "Confirmed npm, vsce, and webpack are installed."

if [[ -d "dist" ]]; then
    echo "Removing existing dist directory."
    rm -r dist || { echo "Failed to remove dist directory. $abort_msg"; exit 3; }
fi

echo "Compiling TypeScript to JavaScript and running webpack to bundle JavaScript."
npm run compile || { echo "Failed to compile TypeScript to JavaScript. $abort_msg"; exit 4; }

echo "Packaging extension into .vsix file."
vsce package || { echo "Failed to package extension. $abort_msg"; exit 5; }

vsix_file=$(ls -t *.vsix | head -1)
target_vsix_file="$vscode_extensions_dir/$vsix_file"

# Check if the .vsix file already exists in the target directory
if [[ -f "$target_vsix_file" ]]; then
    echo "$target_vsix_file already exists."
    # Print file information
    echo "File size: $(du -sh $target_vsix_file)"
    echo "Last modification date: $(stat -f "%Sm" $target_vsix_file)"

    echo "Deleting existing .vsix file."
    rm "$target_vsix_file" || { echo "Failed to delete existing .vsix file. $abort_msg"; exit 6; }
fi

echo "Copying $vsix_file to $vscode_extensions_dir."

cp "$vsix_file" "$vscode_extensions_dir" || { echo "Failed to copy $vsix_file to $vscode_extensions_dir. $abort_msg"; exit 7; }

# Print new file information
echo "New file size: $(du -sh $target_vsix_file)"
echo "New file creation date: $(stat -f "%Sm" $target_vsix_file)"

echo "Successfully copied $vsix_file to $vscode_extensions_dir."

echo "To install the new extension, open VS Code, go to the Extensions view, \
click on the More Actions (...) menu, select 'Install from VSIX...', \
navigate to $vscode_extensions_dir, and select the .vsix file."
