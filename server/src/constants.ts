// Constants for the language server
export const LANGUAGE_ID = 'nsm';

// Regular expressions for various parts of the NSM language
export const BLOCK_COMMENT_PATTERN = /\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm;
export const LINE_COMMENT_PATTERN = /#.*/g;
export const DOUBLE_QUOTED_STRING_PATTERN = /"([^"\\]*(\\.[^"\\]*)*)"/g;
export const CONFIG_SECTION_NAME = 'nsmLanguageServer';
export const MOLECULE_PATTERN =
  /\"\"\"[ \t]*([a-zA-Z0-9_]+)[ \t]*\n+([a-zA-Z0-9_\n ]+)\n\"\"\"/g;

// This is an example configuration for the NSM language
export const NSM_CONFIGURATION = {
  wordPattern: MOLECULE_PATTERN,
  indentationRules: {
    // The language's indentation settings
    increaseIndentPattern: /^.*\{$/,
    decreaseIndentPattern: /^\}/,
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
};
