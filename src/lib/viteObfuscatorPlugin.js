
import * as fs from 'fs';
import * as path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

// Vite plugin for JavaScript obfuscation
export default function obfuscatorPlugin(options = {}) {
  const defaultOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return {
    name: 'vite-plugin-obfuscator',
    apply: 'build',
    enforce: 'post',
    
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.js')) {
          const asset = bundle[fileName];
          if (asset.type === 'chunk' && asset.code) {
            // Obfuscate the code
            const obfuscationResult = JavaScriptObfuscator.obfuscate(
              asset.code,
              mergedOptions
            );
            
            // Replace the original code with obfuscated code
            asset.code = obfuscationResult.getObfuscatedCode();
          }
        }
      }
    }
  };
}
