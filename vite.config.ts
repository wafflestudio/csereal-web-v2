import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr()],
  server: {
    // 카맵 api가 3000번만 열려있는듯
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://cse.snu.ac.kr',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
