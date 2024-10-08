import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
// import devtools from 'solid-devtools/vite';

export default defineConfig({
  plugins: [
    /* 
    Uncomment the following line to enable solid-devtools.
    For more info see https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    */
    // devtools(),
    solidPlugin(),
  ],
  server: {
    port: 3005,
    host: true,
    strictPort: true,
    hmr: {
      protocol: "ws",
      clientPort: 3005,
    },
  },
  publicDir: "public",
  build: {
    target: "esnext",
    outDir: "dist/vanilla",
  },
  base: "/vanilla",
});
