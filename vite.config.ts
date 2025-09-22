import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'url';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/bundle-stats.html', // ruta donde genera el reporte
      open: true, // abre el navegador al terminar build
      gzipSize: true, // muestra tamaño gzip
      brotliSize: true, // muestra tamaño brotli
    }),
  ],
  server: {
    port: 9054,
    strictPort: true,
    host: '0.0.0.0',
    open: '/',
    cors: {
      origin: '*', // Solo para dev, en prod define tu dominio
      methods: ['GET', 'POST'],
    },
  },
  css: {
    modules: {
      generateScopedName: '[hash:base64:5]',
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
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV !== 'production',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, // Para evitar que TypeScript se queje por los tipos
  },
});
