import { IGrammar, Registry, IRawGrammar, IOnigLib } from 'vscode-textmate';
import * as path from 'path';
import * as fs from 'fs';

import { loadWASM, OnigScanner, OnigString } from 'onigasm';

// onigasm is a WebAssembly port of the Oniguruma regular expression library.
// It is used for tokenizing text based on TextMate grammars.
// More about Oniguruma: https://github.com/kkos/oniguruma
// More about onigasm: https://github.com/NeekSandhu/onigasm

// Load onigasm WASM binary and create onigLib
async function loadOnigLib(): Promise<IOnigLib> {
  const wasmPath = require.resolve('onigasm/lib/onigasm.wasm');
  const wasmBinary = fs.readFileSync(wasmPath);
  const wasmBuffer = new Uint8Array(wasmBinary).buffer;

  await loadWASM(wasmBuffer);
  return {
    createOnigScanner: (sources) => new OnigScanner(sources),
    createOnigString: (str) => new OnigString(str),
  };
}

export const SCOPE_NSM = 'source.nsm';

const GRAMMAR_PATH = path.join(
  __dirname,
  '../../',
  'syntaxes',
  'nsm.tmLanguage.json'
);

export function createRegistryInstance(): Registry {
  const onigLibPromise = loadOnigLib();
  return new Registry({
    onigLib: onigLibPromise,
    loadGrammar: async (scopeName: string) => {
      if (scopeName === SCOPE_NSM) {
        const grammarContent = require(GRAMMAR_PATH);
        return grammarContent as IRawGrammar; // IRawGrammar is an interface representing the raw grammar in JSON format
      }
      return null;
    },
  });
}

export async function loadGrammar(registry: Registry): Promise<IGrammar> {
  const grammarData = fs.readFileSync(GRAMMAR_PATH, 'utf8');
  const grammarJson = JSON.parse(grammarData);
  const grammar = await registry.addGrammar(grammarJson);

  return grammar;
}
