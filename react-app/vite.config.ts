import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
    strictPort: true,
    hmr: {
      protocol: "ws",
      clientPort: 3001,
    },
  },
  resolve: {
    alias: {
      'react-circular-progressbar': 'react-circular-progressbar/dist/index.esm.js',
    },
  },
  base: "/react/play",
  build: {
    outDir: 'dist/react/play'
  }
});
