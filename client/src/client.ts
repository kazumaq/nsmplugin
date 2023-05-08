import * as path from 'path';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient/node';
import { ExtensionContext, workspace } from 'vscode';

// Function to create and return the language client
export function createLanguageClient(
  context: ExtensionContext
): LanguageClient {
  // Define the path to the server module
  let serverModule = context.asAbsolutePath(
    path.join('out', 'server', 'src', 'server.js')
  );

  // Define debug options for the server
  let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

  // Define server options for both run and debug modes
  let serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  };

  // Define client options to control the language client
  let clientOptions: LanguageClientOptions = {
    // Register the server for nsm documents
    documentSelector: [{ scheme: 'file', language: 'nsm' }],
    synchronize: {
      // Synchronize the section 'nsmLanguageServer' of the settings to the server
      configurationSection: 'nsmLanguageServer',
      // Notify the server about file changes to '.clientrc' files contained in the workspace
      fileEvents: workspace.createFileSystemWatcher('**/.clientrc'),
    },
  };

  // Create the language client and return it
  return new LanguageClient(
    'nsmLanguageServer',
    'NSM Language Server',
    serverOptions,
    clientOptions
  );
}
