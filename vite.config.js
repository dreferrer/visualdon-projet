import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

module.exports = defineConfig({
    root: 'src',
    build: {
      outDir: '../dist',
      emptyOutDir: true,
    },
    plugins: [
      viteStaticCopy({
        targets: [
          { src: 'data/', dest: '../dist' },
        ] 
      })
    ]
});