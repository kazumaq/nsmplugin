// Import necessary Language Server Protocol (LSP) components from 'vscode-languageserver/node' package.
// LSP docs: https://microsoft.github.io/language-server-protocol/specifications/specification-current/
import {
  createConnection, // Function to create a connection between the server and the client
  TextDocuments, // Class to manage open text documents in the editor
  Diagnostic, // Class to represent diagnostic information (e.g., errors, warnings, etc.)
  DiagnosticSeverity, // Enum for diagnostic severity levels (e.g., error, warning, info, hint)
  ProposedFeatures, // Includes all proposed LSP features that are not yet part of the official specification
  InitializeParams, // Interface for the parameters of the `initialize` request sent by the client
  DidChangeConfigurationNotification, // Notification type for configuration changes
  CompletionItem, // Class to represent a code completion item
  CompletionItemKind, // Enum for completion item types (e.g., method, property, class, etc.)
  TextDocumentPositionParams, // Interface for the position of the text document (used in completion requests)
  TextDocumentSyncKind, // Enum for the synchronization kinds (e.g., full, incremental, none)
  InitializeResult, // Interface for the result of the `initialize` request
} from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

// =============================================================================
// Connection setup
// =============================================================================

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
const connection = createConnection(ProposedFeatures.all);

// Create a simple text document manager to manage open text documents.
// The TextDocuments class provides methods to work with text documents,
// like getting the content, listening for changes, etc.
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

// Flags to store client capabilities
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

// =============================================================================
// Server initialization
// =============================================================================

// The 'onInitialize' event is triggered when the server is initialized.
// We use it to check for the client's capabilities and set up our server accordingly.
connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  // Check for client capabilities
  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  // Return the server's capabilities in response to the client's `initialize` request.
  const result: InitializeResult = {
    capabilities: {
      // Use incremental sync for better performance when syncing document changes.
      textDocumentSync: TextDocumentSyncKind.Incremental,
      // Tell the client that this server supports code completion.
      completionProvider: {
        resolveProvider: true,
      },
    },
  };

  // If the client supports workspace folders, include that in the server's capabilities.
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true,
      },
    };
  }
  return result;
});

// =============================================================================
// Server event listeners
// =============================================================================

// The 'onInitialized' event is triggered after the server is initialized.
// We use it to register for configuration changes and workspace folder changes, if supported.
connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    // Register for all configuration changes.
    connection.client.register(
      DidChangeConfigurationNotification.type,
      undefined
    );
  }

  // Listen for workspace folder changes
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders((_event) => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

// =============================================================================
// Server settings
// =============================================================================

// The example settings structure
interface ExampleSettings {
  maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
const defaultSettings: ExampleSettings = { maxNumberOfProblems: 1000 };
let globalSettings: ExampleSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<ExampleSettings>> = new Map();

// Listen for configuration changes
connection.onDidChangeConfiguration((change) => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings
    documentSettings.clear();
  } else {
    globalSettings = <ExampleSettings>(
      (change.settings.languageServerExample || defaultSettings)
    );
  }

  // Revalidate all open text documents
  documents.all().forEach(validateTextDocument);
});

// Get document settings
// This function retrieves the settings for a specific document (identified by its URI)
// and returns a Promise that resolves to an object containing those settings.
// If the client doesn't have configuration capability, it will return the global settings.
function getDocumentSettings(resource: string): Thenable<ExampleSettings> {
  // Check if the client has configuration capability
  // (i.e., if it can handle workspace/configuration requests).
  // If not, return a Promise that resolves to the global settings.
  // More info on configuration capability: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_configuration
  if (!hasConfigurationCapability) {
    return Promise.resolve(globalSettings);
  }

  // Try to get the document settings from the documentSettings Map.
  let result = documentSettings.get(resource);

  // If the settings are not found in the Map, request the configuration
  // from the client using the connection.workspace.getConfiguration method.
  if (!result) {
    // The getConfiguration method takes an object with two properties:
    // scopeUri (the document URI) and section (the configuration section name).
    // In this case, the section is 'nsmLanguageServer'.
    // More info on getConfiguration: https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/#workspace_getConfiguration
    result = connection.workspace.getConfiguration({
      scopeUri: resource,
      section: 'nsmLanguageServer',
    });

    // Store the retrieved settings in the documentSettings Map
    // for future use, so we don't have to request them again.
    documentSettings.set(resource, result);
  }

  // Return the Promise that resolves to the document settings.
  return result;
}

// Only keep settings for open documents
documents.onDidClose((e) => {
  documentSettings.delete(e.document.uri);
});

// =============================================================================
// Document validation
// =============================================================================

// This event is emitted when the text document is first opened or when its content has changed.
// It triggers the 'validateTextDocument' function to validate the content of the document.
documents.onDidChangeContent((change) => {
  validateTextDocument(change.document);
});

// This function validates a text document and sends diagnostics to the client (VSCode).
// It checks for all-uppercase words with a length of 2 or more and reports them as warnings.
async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  // Get the document settings for each validation run.
  const settings = await getDocumentSettings(textDocument.uri);

  // Extract the text from the document and define a regex pattern for all-uppercase words length 2 and more
  const text = textDocument.getText();
  const pattern = /\b[A-Z]{2,}\b/g;
  let m: RegExpExecArray | null;

  // Iterate through the matches, create diagnostics, and send them to the client.
  let problems = 0;
  const diagnostics: Diagnostic[] = [];
  while ((m = pattern.exec(text)) && problems < settings.maxNumberOfProblems) {
    problems++;
    const diagnostic: Diagnostic = {
      severity: DiagnosticSeverity.Warning,
      range: {
        start: textDocument.positionAt(m.index),
        end: textDocument.positionAt(m.index + m[0].length),
      },
      message: `${m[0]} is all uppercase.`,
      source: 'ex',
    };

    // If the client supports related diagnostic information, add it to the diagnostic.
    if (hasDiagnosticRelatedInformationCapability) {
      diagnostic.relatedInformation = [
        {
          location: {
            uri: textDocument.uri,
            range: Object.assign({}, diagnostic.range),
          },
          message: 'Spelling matters',
        },
        {
          location: {
            uri: textDocument.uri,
            range: Object.assign({}, diagnostic.range),
          },
          message: 'Particularly for names',
        },
      ];
    }
    diagnostics.push(diagnostic);
  }

  // Send the diagnostics to the client (VSCode).
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// =============================================================================
// Watched files change handling
// =============================================================================

// This event is triggered when monitored files change in VSCode.
// For now, we only log the event to the console.
connection.onDidChangeWatchedFiles((_change) => {
  // Monitored files have change in VSCode
  connection.console.log('We received an file change event');
});

// =============================================================================
// Code completion handling
// =============================================================================

// This handler provides the initial list of completion items when code completion is requested.
connection.onCompletion(
  (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    // The pass parameter contains the position of the text document in
    // which code complete got requested. For the example we ignore this
    // info and always provide the same completion items.
    return [
      {
        label: 'TypeScript',
        kind: CompletionItemKind.Text,
        data: 1,
      },
      {
        label: 'JavaScript',
        kind: CompletionItemKind.Text,
        data: 2,
      },
    ];
  }
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  // Add detail and documentation based on the item's data property.
  if (item.data === 1) {
    item.detail = 'TypeScript details';
    item.documentation = 'TypeScript documentation';
  } else if (item.data === 2) {
    item.detail = 'JavaScript details';
    item.documentation = 'JavaScript documentation';
  }
  return item;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
