// vite.config.ts
import { defineConfig } from "file:///home/runner/workspace/node_modules/vite/dist/node/index.js";
import react from "file:///home/runner/workspace/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "path";
import { componentTagger } from "file:///home/runner/workspace/node_modules/lovable-tagger/dist/index.js";

// src/lib/viteObfuscatorPlugin.js
import JavaScriptObfuscator from "file:///home/runner/workspace/node_modules/javascript-obfuscator/dist/index.js";
function obfuscatorPlugin(options = {}) {
  const defaultOptions = {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: true,
    debugProtectionInterval: true,
    disableConsoleOutput: true,
    identifierNamesGenerator: "hexadecimal",
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ["base64"],
    stringArrayThreshold: 0.75,
    transformObjectKeys: true,
    unicodeEscapeSequence: false
  };
  const mergedOptions = { ...defaultOptions, ...options };
  return {
    name: "vite-plugin-obfuscator",
    apply: "build",
    enforce: "post",
    generateBundle(_, bundle) {
      for (const fileName in bundle) {
        if (fileName.endsWith(".js")) {
          const asset = bundle[fileName];
          if (asset.type === "chunk" && asset.code) {
            const obfuscationResult = JavaScriptObfuscator.obfuscate(
              asset.code,
              mergedOptions
            );
            asset.code = obfuscationResult.getObfuscatedCode();
          }
        }
      }
    }
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/home/runner/workspace";
var vite_config_default = defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5e3
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    mode === "production" && obfuscatorPlugin({
      // You can customize obfuscation options here
      stringArrayThreshold: 0.8,
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ["base64"],
      selfDefending: true
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL2xpYi92aXRlT2JmdXNjYXRvclBsdWdpbi5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3J1bm5lci93b3Jrc3BhY2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3J1bm5lci93b3Jrc3BhY2Uvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL2hvbWUvcnVubmVyL3dvcmtzcGFjZS92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XG5pbXBvcnQgcmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7IGNvbXBvbmVudFRhZ2dlciB9IGZyb20gXCJsb3ZhYmxlLXRhZ2dlclwiO1xuaW1wb3J0IG9iZnVzY2F0b3JQbHVnaW4gZnJvbSBcIi4vc3JjL2xpYi92aXRlT2JmdXNjYXRvclBsdWdpblwiO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4gKHtcbiAgc2VydmVyOiB7XG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgcG9ydDogNTAwMCxcbiAgfSxcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAgbW9kZSA9PT0gJ2RldmVsb3BtZW50JyAmJiBjb21wb25lbnRUYWdnZXIoKSxcbiAgICBtb2RlID09PSAncHJvZHVjdGlvbicgJiYgb2JmdXNjYXRvclBsdWdpbih7XG4gICAgICAvLyBZb3UgY2FuIGN1c3RvbWl6ZSBvYmZ1c2NhdGlvbiBvcHRpb25zIGhlcmVcbiAgICAgIHN0cmluZ0FycmF5VGhyZXNob2xkOiAwLjgsXG4gICAgICByb3RhdGVTdHJpbmdBcnJheTogdHJ1ZSxcbiAgICAgIHN0cmluZ0FycmF5OiB0cnVlLFxuICAgICAgc3RyaW5nQXJyYXlFbmNvZGluZzogWydiYXNlNjQnXSxcbiAgICAgIHNlbGZEZWZlbmRpbmc6IHRydWUsXG4gICAgfSksXG4gIF0uZmlsdGVyKEJvb2xlYW4pLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgIH0sXG4gIH0sXG59KSk7XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9ob21lL3J1bm5lci93b3Jrc3BhY2Uvc3JjL2xpYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL2hvbWUvcnVubmVyL3dvcmtzcGFjZS9zcmMvbGliL3ZpdGVPYmZ1c2NhdG9yUGx1Z2luLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3J1bm5lci93b3Jrc3BhY2Uvc3JjL2xpYi92aXRlT2JmdXNjYXRvclBsdWdpbi5qc1wiO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBKYXZhU2NyaXB0T2JmdXNjYXRvciBmcm9tICdqYXZhc2NyaXB0LW9iZnVzY2F0b3InO1xuXG4vLyBWaXRlIHBsdWdpbiBmb3IgSmF2YVNjcmlwdCBvYmZ1c2NhdGlvblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gb2JmdXNjYXRvclBsdWdpbihvcHRpb25zID0ge30pIHtcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgY29tcGFjdDogdHJ1ZSxcbiAgICBjb250cm9sRmxvd0ZsYXR0ZW5pbmc6IHRydWUsXG4gICAgY29udHJvbEZsb3dGbGF0dGVuaW5nVGhyZXNob2xkOiAwLjc1LFxuICAgIGRlYWRDb2RlSW5qZWN0aW9uOiB0cnVlLFxuICAgIGRlYWRDb2RlSW5qZWN0aW9uVGhyZXNob2xkOiAwLjQsXG4gICAgZGVidWdQcm90ZWN0aW9uOiB0cnVlLFxuICAgIGRlYnVnUHJvdGVjdGlvbkludGVydmFsOiB0cnVlLFxuICAgIGRpc2FibGVDb25zb2xlT3V0cHV0OiB0cnVlLFxuICAgIGlkZW50aWZpZXJOYW1lc0dlbmVyYXRvcjogJ2hleGFkZWNpbWFsJyxcbiAgICBsb2c6IGZhbHNlLFxuICAgIHJlbmFtZUdsb2JhbHM6IGZhbHNlLFxuICAgIHJvdGF0ZVN0cmluZ0FycmF5OiB0cnVlLFxuICAgIHNlbGZEZWZlbmRpbmc6IHRydWUsXG4gICAgc3BsaXRTdHJpbmdzOiB0cnVlLFxuICAgIHNwbGl0U3RyaW5nc0NodW5rTGVuZ3RoOiAxMCxcbiAgICBzdHJpbmdBcnJheTogdHJ1ZSxcbiAgICBzdHJpbmdBcnJheUVuY29kaW5nOiBbJ2Jhc2U2NCddLFxuICAgIHN0cmluZ0FycmF5VGhyZXNob2xkOiAwLjc1LFxuICAgIHRyYW5zZm9ybU9iamVjdEtleXM6IHRydWUsXG4gICAgdW5pY29kZUVzY2FwZVNlcXVlbmNlOiBmYWxzZVxuICB9O1xuXG4gIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB7IC4uLmRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH07XG5cbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndml0ZS1wbHVnaW4tb2JmdXNjYXRvcicsXG4gICAgYXBwbHk6ICdidWlsZCcsXG4gICAgZW5mb3JjZTogJ3Bvc3QnLFxuICAgIFxuICAgIGdlbmVyYXRlQnVuZGxlKF8sIGJ1bmRsZSkge1xuICAgICAgZm9yIChjb25zdCBmaWxlTmFtZSBpbiBidW5kbGUpIHtcbiAgICAgICAgaWYgKGZpbGVOYW1lLmVuZHNXaXRoKCcuanMnKSkge1xuICAgICAgICAgIGNvbnN0IGFzc2V0ID0gYnVuZGxlW2ZpbGVOYW1lXTtcbiAgICAgICAgICBpZiAoYXNzZXQudHlwZSA9PT0gJ2NodW5rJyAmJiBhc3NldC5jb2RlKSB7XG4gICAgICAgICAgICAvLyBPYmZ1c2NhdGUgdGhlIGNvZGVcbiAgICAgICAgICAgIGNvbnN0IG9iZnVzY2F0aW9uUmVzdWx0ID0gSmF2YVNjcmlwdE9iZnVzY2F0b3Iub2JmdXNjYXRlKFxuICAgICAgICAgICAgICBhc3NldC5jb2RlLFxuICAgICAgICAgICAgICBtZXJnZWRPcHRpb25zXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBvcmlnaW5hbCBjb2RlIHdpdGggb2JmdXNjYXRlZCBjb2RlXG4gICAgICAgICAgICBhc3NldC5jb2RlID0gb2JmdXNjYXRpb25SZXN1bHQuZ2V0T2JmdXNjYXRlZENvZGUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQW9QLFNBQVMsb0JBQW9CO0FBQ2pSLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx1QkFBdUI7OztBQ0FoQyxPQUFPLDBCQUEwQjtBQUdsQixTQUFSLGlCQUFrQyxVQUFVLENBQUMsR0FBRztBQUNyRCxRQUFNLGlCQUFpQjtBQUFBLElBQ3JCLFNBQVM7QUFBQSxJQUNULHVCQUF1QjtBQUFBLElBQ3ZCLGdDQUFnQztBQUFBLElBQ2hDLG1CQUFtQjtBQUFBLElBQ25CLDRCQUE0QjtBQUFBLElBQzVCLGlCQUFpQjtBQUFBLElBQ2pCLHlCQUF5QjtBQUFBLElBQ3pCLHNCQUFzQjtBQUFBLElBQ3RCLDBCQUEwQjtBQUFBLElBQzFCLEtBQUs7QUFBQSxJQUNMLGVBQWU7QUFBQSxJQUNmLG1CQUFtQjtBQUFBLElBQ25CLGVBQWU7QUFBQSxJQUNmLGNBQWM7QUFBQSxJQUNkLHlCQUF5QjtBQUFBLElBQ3pCLGFBQWE7QUFBQSxJQUNiLHFCQUFxQixDQUFDLFFBQVE7QUFBQSxJQUM5QixzQkFBc0I7QUFBQSxJQUN0QixxQkFBcUI7QUFBQSxJQUNyQix1QkFBdUI7QUFBQSxFQUN6QjtBQUVBLFFBQU0sZ0JBQWdCLEVBQUUsR0FBRyxnQkFBZ0IsR0FBRyxRQUFRO0FBRXRELFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxJQUNQLFNBQVM7QUFBQSxJQUVULGVBQWUsR0FBRyxRQUFRO0FBQ3hCLGlCQUFXLFlBQVksUUFBUTtBQUM3QixZQUFJLFNBQVMsU0FBUyxLQUFLLEdBQUc7QUFDNUIsZ0JBQU0sUUFBUSxPQUFPLFFBQVE7QUFDN0IsY0FBSSxNQUFNLFNBQVMsV0FBVyxNQUFNLE1BQU07QUFFeEMsa0JBQU0sb0JBQW9CLHFCQUFxQjtBQUFBLGNBQzdDLE1BQU07QUFBQSxjQUNOO0FBQUEsWUFDRjtBQUdBLGtCQUFNLE9BQU8sa0JBQWtCLGtCQUFrQjtBQUFBLFVBQ25EO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUR2REEsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sU0FBUyxpQkFBaUIsZ0JBQWdCO0FBQUEsSUFDMUMsU0FBUyxnQkFBZ0IsaUJBQWlCO0FBQUE7QUFBQSxNQUV4QyxzQkFBc0I7QUFBQSxNQUN0QixtQkFBbUI7QUFBQSxNQUNuQixhQUFhO0FBQUEsTUFDYixxQkFBcUIsQ0FBQyxRQUFRO0FBQUEsTUFDOUIsZUFBZTtBQUFBLElBQ2pCLENBQUM7QUFBQSxFQUNILEVBQUUsT0FBTyxPQUFPO0FBQUEsRUFDaEIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
