// Import required modules
import * as assert from "assert";
import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  IGrammar,
  Registry,
  INITIAL,
  IRawGrammar,
  IOnigLib,
} from "vscode-textmate";
import { loadWASM, OnigScanner, OnigString } from "onigasm";

// onigasm is a WebAssembly port of the Oniguruma regular expression library.
// It is used for tokenizing text based on TextMate grammars.
// More about Oniguruma: https://github.com/kkos/oniguruma
// More about onigasm: https://github.com/NeekSandhu/onigasm

// Load onigasm WASM binary and create onigLib
// onigLib is an object implementing IOnigLib interface, which is required by vscode-textmate
// More about vscode-textmate: https://github.com/microsoft/vscode-textmate
async function loadOnigLib(): Promise<IOnigLib> {
  const wasmPath = require.resolve("onigasm/lib/onigasm.wasm");
  const wasmBinary = fs.readFileSync(wasmPath);
  const wasmBuffer = new Uint8Array(wasmBinary).buffer;

  await loadWASM(wasmBuffer);
  return {
    createOnigScanner: (sources) => new OnigScanner(sources),
    createOnigString: (str) => new OnigString(str),
  };
}

const SCOPE_NSM = "source.nsm";
const GRAMMAR_PATH = path.join(
  __dirname,
  "../../..",
  "syntaxes",
  "nsm.tmLanguage.json",
);

// Define a test suite for the extension
// Test suites help organize test cases for different aspects of the extension
// More about Mocha test suites: https://mochajs.org/#suite
suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  // Define a simple test case as an example
  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

// Define a test suite specifically for NSM Grammar
suite("NSM Grammar", () => {
  let registry: Registry;
  let grammar: IGrammar;

  // Setup code to be executed before running any test in the suite
  // This code initializes the Registry and loads the grammar for testing
  suiteSetup(async () => {
    const onigLibPromise = loadOnigLib();
    registry = new Registry({
      onigLib: onigLibPromise,
      loadGrammar: async (scopeName: string) => {
        if (scopeName === SCOPE_NSM) {
          const grammarContent = require(GRAMMAR_PATH);
          return grammarContent as IRawGrammar;
        }
        return null;
      },
    });

    // Load the grammar
    const grammarContent = require(GRAMMAR_PATH);
    grammar = await registry.addGrammar(grammarContent as IRawGrammar);
  });

  // Function to test tokenization of a given code snippet
  // This function tokenizes the sample code using the grammar and compares the result with expected tokens
  function testTokenization(sampleCode: string, expectedTokens: any) {
    // Initialize prevState as null
    const prevState = INITIAL;

    // Tokenize the sample code
    const lineTokens = grammar.tokenizeLine(sampleCode, prevState).tokens;

    // Compare the actual and expected tokenization
    assert.deepStrictEqual(lineTokens, expectedTokens);
  }

  // Test case for tokenization
  test("Tokenization", () => {
    const sampleCode = "I WANT THIS THING";
    const expectedTokens = [
      {
        startIndex: 0,
        endIndex: 1,
        scopes: [SCOPE_NSM, "entity.name.type"],
      },
      {
        startIndex: 1,
        endIndex: 2,
        scopes: [SCOPE_NSM],
      },
      {
        startIndex: 2,
        endIndex: 6,
        scopes: [SCOPE_NSM, "support.function"],
      },
      {
        startIndex: 6,
        endIndex: 7,
        scopes: [SCOPE_NSM],
      },
      {
        startIndex: 7,
        endIndex: 11,
        scopes: [SCOPE_NSM, "variable.parameter"],
      },
      {
        startIndex: 11,
        endIndex: 12,
        scopes: [SCOPE_NSM],
      },
      {
        startIndex: 12,
        endIndex: 17,
        scopes: [SCOPE_NSM, "entity.name.type"],
      },
    ];

    testTokenization(sampleCode, expectedTokens);
  });

  // Add more test cases here
  // Example:
  // test("Another Tokenization", () => {
  //   const sampleCode = "SAMPLE CODE HERE";
  //   const expectedTokens = [
  //     // Expected tokenization structure
  //   ];
  //   testTokenization(sampleCode, expectedTokens);
  // });
});
