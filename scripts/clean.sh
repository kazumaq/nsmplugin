#!/usr/bin/bash

# Enable xtrace option for debugging purposes
set -x

# Remove the 'out' directory and its contents
# The 'out' directory usually contains compiled files or build artifacts
rm -rf out

# Remove the 'node_modules' directory and its contents
# This directory contains all the dependencies installed by npm or yarn
rm -rf node_modules

rm package-lock.json

rm -rf .vscode-test
