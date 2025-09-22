import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

const isDev = process.env.VITE_NODE_ENV !== 'production';

export default defineConfig({
  plugins: [
    react(),
    isDev &&
      visualizer({
        filename: 'dist/bundle-stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
  ].filter(Boolean), // filtramos null en producción
  server: {
    port: 9054,
    strictPort: true,
    host: '0.0.0.0',
    open: '/',
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@api': fileURLToPath(new URL('./src/api', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@constants': fileURLToPath(new URL('./src/constants', import.meta.url)),
      '@layouts': fileURLToPath(new URL('./src/layouts', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@providers': fileURLToPath(new URL('./src/providers', import.meta.url)),
      '@routes': fileURLToPath(new URL('./src/routes', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/stores', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@schemas': fileURLToPath(new URL('./src/schemas', import.meta.url)),
      '@registry': fileURLToPath(new URL('./src/registry', import.meta.url)),
    },
  },
  css: {
    // solo necesario si mezclas CSS Modules con Tailwind
    modules: {
      generateScopedName: '[hash:base64:5]',
    },
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: isDev,
    minify: 'esbuild', // más rápido que terser, suficiente para React
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('recharts')) return 'charts';
            if (id.includes('@tanstack')) return 'tanstack';
            return 'vendor';
          }
        },
      },
    },
  },
});
