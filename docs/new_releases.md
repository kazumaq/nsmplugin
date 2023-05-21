# NSMPlugin Release Guide

This guide will help you release a new version of the NSMPlugin VSCode extension.

## Prerequisites

Before starting, you need to make sure that the following tools are installed on your system:

- `jq`: a command-line JSON processor.
- `gh`: the GitHub CLI tool.

You can install these tools using the following commands:

### MacOS:

```bash
brew install jq
brew install gh
```

### Ubuntu:

```bash
sudo apt-get install jq
gh: Follow the instructions at https://cli.github.com/manual/installation
```

## Creating a New Release

To create a new release of the NSMPlugin, you need to run our release script with the new version as an argument.

Here's how you do it:

1. Open a terminal.
2. Navigate to the root directory of the NSMPlugin project.
3. Run the release script, replacing `vX.Y.Z` with your version:

   ```bash
   ./scripts/release.sh vX.Y.Z
   ```

For example, if you want to release version `v0.1.0`, you would run:

```bash
./scripts/release.sh v0.1.0
```

This script does the following:

1. Updates the version in all `package.json` files in the project.
2. Commits these changes to git.
3. Pushes the changes to the remote repository.
4. Tags the new release in git.
5. Pushes the tag to the remote repository.
6. Creates a new release on GitHub with the given version.
