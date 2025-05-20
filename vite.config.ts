
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import obfuscatorPlugin from "./src/lib/viteObfuscatorPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    mode === 'production' && obfuscatorPlugin({
      // You can customize obfuscation options here
      stringArrayThreshold: 0.8,
      rotateStringArray: true,
      stringArray: true,
      stringArrayEncoding: ['base64'],
      selfDefending: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
