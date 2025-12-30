import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  // Load env file based on mode from env/ directory
  const env = loadEnv(mode, 'env');
  const API_TARGET = env.VITE_API_BASE_URL;

  return {
    envDir: 'env',
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), svgr()],
    server: {
      // 카맵 api가 3000번만 열려있는듯
      port: 3000,
      proxy: {
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
  };
});
