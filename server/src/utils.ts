import { DiagnosticSeverity, Diagnostic } from 'vscode-languageserver/node';

import { TextDocument } from 'vscode-languageserver-textdocument';

import {
  BLOCK_COMMENT_PATTERN,
  LINE_COMMENT_PATTERN,
  DOUBLE_QUOTED_STRING_PATTERN,
} from './constants';

export function replaceCommentsWithWhitespace(text: string): string {
  // This pattern matches block comments, line comments, and double-quoted strings.
  // All these will be replaced with whitespaces.
  const pattern = new RegExp(
    `(?:${BLOCK_COMMENT_PATTERN.source})|(?:${LINE_COMMENT_PATTERN.source})|(?:${DOUBLE_QUOTED_STRING_PATTERN.source})`,
    'g'
  );

  let result = text.replace(pattern, (match: string) => {
    const replaced = match.replace(/[^\r\n]/g, ' ');
    return replaced;
  });

  return result;
}

export const createDiagnostic = (
  word: string,
  match: RegExpExecArray,
  textDocument: TextDocument
): Diagnostic => {
  const diagnostic: Diagnostic = {
    severity: DiagnosticSeverity.Warning,
    range: {
      start: textDocument.positionAt(match.index),
      end: textDocument.positionAt(match.index + word.length),
    },
    message: `${word} is not a valid NSM keyword.`,
    source: 'nsm',
  };
  return diagnostic;
};

// Flags to store client capabilities
export let hasConfigurationCapability = false;
export let hasWorkspaceFolderCapability = false;
export let hasDiagnosticRelatedInformationCapability = false;

// Extract client capabilities check into a function
export function checkClientCapabilities(capabilities: any) {
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
}
