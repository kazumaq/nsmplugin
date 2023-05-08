import * as path from 'path';
import { createLanguageClient } from '../client/src/client';

// Import the VS Code extensibility API
import { commands, ExtensionContext, window } from 'vscode';

// Define the LanguageClient variable
let client: ReturnType<typeof createLanguageClient>;

// This method is called when your extension is activated
export function activate(context: ExtensionContext) {
  console.log('Seeing activation!');

  // Initialize the LanguageClient using the createLanguageClient function
  client = createLanguageClient(context);

  // Start the client. This will also launch the server
  client.start();

  // Log a message when the extension is activated
  console.log('Congratulations, your extension "nsmplugin" is now active!');

  // Register the command defined in the package.json file
  // The commandId parameter must match the command field in package.json
  const disposable = commands.registerCommand('nsmplugin.helloWorld', () => {
    // This code will be executed every time the command is executed
    // Display a message box to the user
    window.showInformationMessage('Hello World from nsmplugin!');
  });

  // Add the disposable command to the context's subscriptions
  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate(): Thenable<void> | undefined {
  // If the client is not initialized, return undefined
  if (!client) {
    return undefined;
  }

  // Stop the client
  return client.stop();
}
