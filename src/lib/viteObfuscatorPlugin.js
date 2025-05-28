
import * as fs from 'fs';
import * as path from 'path';
import JavaScriptObfuscator from 'javascript-obfuscator';

// Vite plugin for JavaScript obfuscation
export default function obfuscatorPlugin(options = {}) {
  const defaultOptions = {
    compact: true,
    controlFlowFlattening: false,
    controlFlowFlatteningThreshold: 0,
    deadCodeInjection: false,
    deadCodeInjectionThreshold: 0,
    debugProtection: false,
    debugProtectionInterval: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: false,
    selfDefending: false,
    splitStrings: false,
    splitStringsChunkLength: 5,
    stringArray: false,
    stringArrayEncoding: [],
    stringArrayThreshold: 0,
    transformObjectKeys: false,
    unicodeEscapeSequence: false
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return {
    name: 'vite-plugin-obfuscator',
    apply: 'build',
    enforce: 'post',
    
    generateBundle(_, bundle) {
      // Temporarily disabled obfuscation for faster builds
      // You can re-enable this later if needed
      return;
      
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
