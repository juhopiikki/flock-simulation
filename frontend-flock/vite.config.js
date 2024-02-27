import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Import the necessary plugin
import NodeGlobalsPolyfillPlugin from '@esbuild-plugins/node-globals-polyfill';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*optimizeDeps: {
    esbuildOptions: {
      // Specify Node.js global variables to polyfill.
      define: {
        global: 'globalThis'
      },
      // Include the plugin to polyfill Node.js globals.
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true
        })
      ]
    }
  }*/
  define: {
    global: 'window', // Define 'global' as an alias for 'window'
    'process.env': {} // Mock process.env if needed
  }
})
