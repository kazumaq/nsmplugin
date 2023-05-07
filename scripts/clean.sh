#!/usr/bin/bash

# Enable xtrace option for debugging purposes
set -x

# Remove the 'out' directory and its contents
# The 'out' directory usually contains compiled files or build artifacts
rm -rf out

# Remove the 'node_modules' directory and its contents
# This directory contains all the dependencies installed by npm or yarn
rm -rf node_modules
rm -rf .vscode-test
rm package-lock.json

rm -rf server/node_modules
rm -rf server/.vscode-test
rm server/package-lock.json

rm -rf client/node_modules
rm -rf client/.vscode-test
rm client/package-lock.json
