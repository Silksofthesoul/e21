// std
import { fileURLToPath, URL } from 'url';
import { resolve, join } from 'path';

// dependencies
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const data = {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@lib': fileURLToPath(new URL('./library', import.meta.url)),
      }
    }
  };
  return data;
});
