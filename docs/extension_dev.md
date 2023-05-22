## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

# Testing the extension

## Run tests

- Open the debug viewlet (`Ctrl+Shift+D` or `Cmd+Shift+D` on Mac) and from the launch configuration dropdown pick `Extension Tests`.
- Press `F5` to run the tests in a new window with your extension loaded.
- See the output of the test result in the debug console.
- Make changes to `src/test/suite/extension.test.ts` or create new test files inside the `test/suite` folder.
  - The provided test runner will only consider files matching the name pattern `**.test.ts`.
  - You can create folders inside the `test` folder to structure your tests any way you want.

## Go further

- [Follow UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview) to create extensions that seamlessly integrate with VS Code's native interface and patterns.
- Reduce the extension size and improve the startup time by [bundling your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension).
- [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension) on the VS Code extension marketplace.
- Automate builds by setting up [Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration).

## Development

Install the requirements per this guide: https://code.visualstudio.com/api/get-started/your-first-extension

### Releasing a New Version of the NSMPlugin VS Code Extension

This guide will walk you through the steps to release a new version of the NSMPlugin extension for Visual Studio Code.

#### Step 1: Update your code

Make sure all the changes you want to include in the release are merged into the `main` branch. Resolve any issues or bugs that have been reported and ensure your code is ready for the release.

#### Step 2: Run the release script

Now, you will use the release script to bump the version number and create a new GitHub release. Here is how to do it:

1. Open a terminal.
2. Navigate to the root directory of the NSMPlugin project.
3. Run the release script, replacing `vX.Y.Z` with your version:

   ```bash
   ./scripts/release.sh vX.Y.Z
   ```

This will automatically update the version in all `package.json` files, commit these changes to git, push the changes to the remote repository, create a new git tag, push this tag to the remote repository, and create a new release on GitHub.

#### Step 3: Package your extension

After your code updates are committed and pushed, you're ready to package your extension. Run the `vsce package` command to create a VSIX file, which is the packaged extension.

```bash
vsce package
```

This will create a `.vsix` file in your project directory with a name like `nsmplugin-X.Y.Z.vsix`, where `X.Y.Z` is the new version number.

#### Step 4: Upload the VSIX file to the Visual Studio Marketplace

Finally, upload the VSIX file to the Visual Studio Marketplace.
