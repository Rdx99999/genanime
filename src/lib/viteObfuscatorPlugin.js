
// Lightweight custom obfuscation plugin
export default function obfuscatorPlugin(options = {}) {
  const settings = {
    minify: true,
    renameVariables: true,
    ...options
  };

  // Simple variable name obfuscation
  function obfuscateCode(code) {
    if (!settings.minify && !settings.renameVariables) return code;
    
    let obfuscated = code;
    
    // Basic minification - remove comments and extra whitespace
    if (settings.minify) {
      obfuscated = obfuscated
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
    }
    
    // Basic variable renaming for common patterns
    if (settings.renameVariables) {
      const varMap = new Map();
      let varCounter = 0;
      
      // Simple pattern matching for basic obfuscation
      obfuscated = obfuscated.replace(/\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g, (match) => {
        // Skip reserved words and common patterns
        const reserved = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'true', 'false', 'null', 'undefined'];
        if (reserved.includes(match) || match.length < 3) return match;
        
        if (!varMap.has(match)) {
          varMap.set(match, `_${varCounter.toString(36)}`);
          varCounter++;
        }
        return varMap.get(match);
      });
    }
    
    return obfuscated;
  }

  return {
    name: 'vite-plugin-lightweight-obfuscator',
    apply: 'build',
    enforce: 'post',
    
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith('.js')) {
          const asset = bundle[fileName];
          if (asset.type === 'chunk' && asset.code) {
            asset.code = obfuscateCode(asset.code);
          }
        }
      }
    }
  };
}
