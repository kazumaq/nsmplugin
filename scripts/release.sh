#!/bin/bash

# This script automates the release process of the NSMPlugin VS Code extension.
# It updates the version number in the project's package.json files, commits these changes,
# creates a git tag for the new version, pushes these changes and the tag to the remote repository,
# and creates a new release on GitHub. The version provided must follow the semantic versioning style.

# Ensure a version argument was provided
if [ -z "$1" ]; then
  echo "Error: You must specify a version. e.g. ./release.sh v1.2.3"
  exit 1
fi

# Ensure the version follows semantic versioning style
if [[ ! $1 =~ ^v([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
  echo "Error: Version must follow semantic versioning style. e.g. v1.2.3"
  exit 1
fi

VERSION=$1
# Remove the 'v' prefix
VERSION=${VERSION#v}

# Update version in all package.json files
echo "Updating version in package.json files..."
if jq ".version = \"$VERSION\"" package.json > package.tmp.json && mv package.tmp.json package.json &&
  jq ".version = \"$VERSION\"" server/package.json > server/package.tmp.json && mv server/package.tmp.json server/package.json &&
  jq ".version = \"$VERSION\"" client/package.json > client/package.tmp.json && mv client/package.tmp.json client/package.json
then
  echo "Successfully updated version in package.json files."
else
  echo "Error updating version in package.json files."
  exit 1
fi

# Commit these changes
echo "Committing version change..."
if git add . && git commit -m "Bump version to $VERSION"
then
  echo "Successfully committed version change."
else
  echo "Error committing version change."
  exit 1
fi

# Push the changes
echo "Pushing commit..."
if git push
then
  echo "Successfully pushed commit."
else
  echo "Error pushing commit."
  exit 1
fi

# Create a new git tag for this version
echo "Creating git tag..."
if git tag v$VERSION
then
  echo "Successfully created git tag."
else
  echo "Error creating git tag."
  exit 1
fi

# Push the tag to the remote repository
echo "Pushing git tag..."
if git push --tags
then
  echo "Successfully pushed git tag."
else
  echo "Error pushing git tag."
  exit 1
fi

# Create a new release on GitHub
echo "Creating GitHub release..."
if gh release create v$VERSION --title "v$VERSION" --generate-notes
then
  echo "Successfully created GitHub release."
else
  echo "Error creating GitHub release."
  exit 1
fi

echo "Release process completed successfully."
