import * as assert from "assert";
import * as fs from "fs";

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from "vscode";
// import * as myExtension from '../../extension';

suite("Extension Test Suite", () => {
  vscode.window.showInformationMessage("Start all tests.");

  test("Sample test", () => {
    assert.strictEqual(-1, [1, 2, 3].indexOf(5));
    assert.strictEqual(-1, [1, 2, 3].indexOf(0));
  });
});

import * as path from "path";
import { Registry, INITIAL, IRawGrammar, IOnigLib } from "vscode-textmate";
import { loadWASM, OnigScanner, OnigString } from "onigasm";

// Load onigasm WASM binary and create onigLib
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

suite("NSM Grammar", () => {
  test("Tokenization", async () => {
    const onigLibPromise = loadOnigLib();
    const registry = new Registry({
      onigLib: onigLibPromise,
      loadGrammar: async (scopeName: string) => {
        if (scopeName === "source.nsm") {
          const grammarPath = path.join(
            __dirname,
            "../../..",
            "syntaxes",
            "nsm.tmLanguage.json",
          );
          const grammarContent = require(grammarPath);
          return grammarContent as IRawGrammar;
        }
        return null;
      },
    });

    // Load the grammar
    const grammarPath = path.join(
      __dirname,
      "../../..",
      "syntaxes",
      "nsm.tmLanguage.json",
    );
    const grammarContent = require(grammarPath);
    const grammar = await registry.addGrammar(grammarContent as IRawGrammar);

    // Sample code for testing
    const sampleCode = "I WANT THIS THING";

    // Initialize prevState as null
    const prevState = INITIAL;

    // Expected tokenization
    const expectedTokens = [
      {
        startIndex: 0,
        endIndex: 1,
        scopes: ["source.nsm", "entity.name.type"],
      },
      {
        startIndex: 1,
        endIndex: 2,
        scopes: ["source.nsm"],
      },
      {
        startIndex: 2,
        endIndex: 6,
        scopes: ["source.nsm", "support.function"],
      },
      {
        startIndex: 6,
        endIndex: 7,
        scopes: ["source.nsm"],
      },
      {
        startIndex: 7,
        endIndex: 11,
        scopes: ["source.nsm", "variable.parameter"],
      },
      {
        startIndex: 11,
        endIndex: 12,
        scopes: ["source.nsm"],
      },
      {
        startIndex: 12,
        endIndex: 17,
        scopes: ["source.nsm", "entity.name.type"],
      },
    ];

    // Tokenize the sample code
    const lineTokens = grammar.tokenizeLine(sampleCode, prevState).tokens;

    // Compare the actual and expected tokenization
    assert.deepStrictEqual(lineTokens, expectedTokens);
  });
});
