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

import { IGrammar, Registry } from 'vscode-textmate';
import { debounce } from 'lodash';

import {
  createDiagnostic,
  hasConfigurationCapability,
  hasWorkspaceFolderCapability,
  replaceCommentsWithWhitespace,
  checkClientCapabilities,
} from './utils';

let customMolecules = new Set<string>();

import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  grammarWords,
  CONFIG_SECTION_NAME,
  MOLECULE_PATTERN,
} from './constants';

import {
  createRegistryInstance,
  loadGrammar,
} from '../../shared/grammar-utils';

let registry: Registry; // Registry object from vscode-textmate, responsible for managing and loading grammars
let grammar: IGrammar; // IGrammar interface from vscode-textmate, used to tokenize text

async function initializeGrammar(): Promise<void> {
  try {
    // Create a new Registry instance with the onigLib and loadGrammar callback
    registry = createRegistryInstance();
    // Load the grammar
    grammar = await loadGrammar(registry);
  } catch (err) {
    console.error('Error loading grammar:', err);
  }
}

// Immediately call the loadGrammar function
initializeGrammar();

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

// =============================================================================
// Server initialization
// =============================================================================

// The 'onInitialize' event is triggered when the server is initialized.
// We use it to check for the client's capabilities and set up our server accordingly.
connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  // Check for client capabilities
  checkClientCapabilities(capabilities);

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

  // Check if client supports workspace folders (root folders in a workspace).
  // Including this improves multi-root handling in VSCode.
  // More info: https://code.visualstudio.com/docs/editor/multi-root-workspaces
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
// Remember to register listeners to handle desired events and provide custom functionality.

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

// The NSM server settings structure
interface NSMServerSettings {
  maxNumberOfProblems: number;
}

// The global settings, used when the `workspace/configuration` request is not supported by the client.
const defaultSettings: NSMServerSettings = { maxNumberOfProblems: 1000 };
let globalSettings: NSMServerSettings = defaultSettings;

// Cache the settings of all open documents
const documentSettings: Map<string, Thenable<NSMServerSettings>> = new Map();

// Listen for configuration changes
connection.onDidChangeConfiguration((change) => {
  if (hasConfigurationCapability) {
    // Reset all cached document settings
    documentSettings.clear();
  } else {
    globalSettings = <NSMServerSettings>(
      (change.settings.languageServerNSMServer || defaultSettings)
    );
  }

  // Revalidate all open text documents
  documents.all().forEach(validateTextDocument);
});

// Get document settings
function getDocumentSettings(resource: string): Thenable<NSMServerSettings> {
  try {
    if (!hasConfigurationCapability) {
      return Promise.resolve(globalSettings);
    }

    // Try to get the document settings from the documentSettings Map.
    let result = documentSettings.get(resource);

    if (!result) {
      result = connection.workspace.getConfiguration({
        scopeUri: resource,
        section: CONFIG_SECTION_NAME,
      });

      documentSettings.set(resource, result);
    }

    // Return the Promise that resolves to the document settings.
    return result;
  } catch (err) {
    console.error('Error getting document settings:', err);
    return Promise.resolve(defaultSettings); // Fall back to default settings on error
  }
}

// Only keep settings for open documents
documents.onDidClose((e) => {
  documentSettings.delete(e.document.uri);
});

// =============================================================================
// Document validation
// =============================================================================
const debouncedUpdateAndValidate = debounce(async (document: TextDocument) => {
  await updateCustomMolecules(document);
  validateTextDocument(document);
}, 300);

// This event is emitted when the text document is first opened or when its content has changed.
// It triggers the 'validateTextDocument' function to validate the content of the document.
documents.onDidChangeContent((change) => {
  debouncedUpdateAndValidate(change.document);
});

async function updateCustomMolecules(document: TextDocument): Promise<void> {
  try {
    console.log('in updateCustomMolecules()');
    // Extract the molecules from the document
    customMolecules = extractMolecules(document.getText());
  } catch (err) {
    console.error('Error updating custom molecules:', err);
  }
}

//
function getMatchedMolecules(text: string): string[] {
  const molecules = [];
  let match;

  while ((match = MOLECULE_PATTERN.exec(text)) !== null) {
    molecules.push(match[1]);
  }

  return molecules;
}

// Create a function to extract molecules from the document
function extractMolecules(text: string): Set<string> {
  console.log('in extractMolecules()');
  const molecules = new Set<string>(getMatchedMolecules(text));
  return molecules;
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  try {
    console.log('in validateTextDocument()');
    // Get the document settings for each validation run.
    const settings = await getDocumentSettings(textDocument.uri);

    // Extract the text from the document and define a regex pattern for all-uppercase words length 2 and more
    const text = textDocument.getText();
    const strippedText = replaceCommentsWithWhitespace(text);

    const pattern = /\b\w+\b/g;

    const diagnostics: Diagnostic[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(strippedText))) {
      const word = match[0];
      if (!grammarWords.has(word) && !customMolecules.has(word)) {
        const diagnostic = createDiagnostic(word, match, textDocument);
        diagnostics.push(diagnostic);
      }
    }

    // Send the diagnostics to the client (VSCode).
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
  } catch (err) {
    console.error('Error validating text document:', err);
  }
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
    // which code complete got requested. For the NSM server we ignore this
    // info and always provide the same completion items.
    const allWords = new Set([
      ...Array.from(grammarWords),
      ...Array.from(customMolecules),
    ]);
    return Array.from(allWords).map((word, index) => ({
      label: word,
      kind: CompletionItemKind.Text,
      data: index,
    }));
  }
);

// This handler resolves additional information for the item selected in
// the completion list.
connection.onCompletionResolve((item: CompletionItem): CompletionItem => {
  // Provide additional information for the completion items if necessary
  item.detail = `${item.label} keyword from the NSM grammar`;
  return item;
});

// Make the text document manager listen on the connection
// for open, change and close text document events
documents.listen(connection);

// Listen on the connection
connection.listen();
