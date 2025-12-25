import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

// Default to local dev server, fallback to prod
const API_TARGET =
  process.env.VITE_API_TARGET || 'https://168.107.16.249.nip.io';

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr()],
  server: {
    // 카맵 api가 3000번만 열려있는듯
    port: 3000,
    proxy: {
      // 개발 전용 프록시: 프로덕션 서버의 파일을 가져올 때 사용
      '/dev-proxy-file': {
        target: 'https://cse.snu.ac.kr',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/dev-proxy-file/, '/api/v1/file'),
      },
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('-→', req.method, req.url);
            proxyReq.removeHeader('origin'); // 서버에서 내려오는 CORS 에러 방지
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('←-', proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
