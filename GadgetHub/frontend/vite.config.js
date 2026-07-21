import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import http from 'http';

const defaultProducts = [
  {
    id: 1,
    name: 'Apple iPhone 15 Pro',
    category: 'Smartphones',
    price: 999,
    originalPrice: 1199,
    rating: 4.8,
    reviews: 2341,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    badge: 'Best Seller',
    description: 'The latest iPhone with A17 Pro chip, titanium design, and the most advanced camera system ever.',
    inStock: true,
    specs: ['A17 Pro Chip', '48MP Camera', 'Titanium Frame', '6.1" Super Retina Display'],
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphones',
    price: 1299,
    originalPrice: 1399,
    rating: 4.7,
    reviews: 1876,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    badge: 'New',
    description: 'The ultimate Android flagship with built-in S Pen, 200MP camera, and AI-powered features.',
    inStock: true,
    specs: ['Snapdragon 8 Gen 3', '200MP Camera', 'S Pen Included', '6.8" Dynamic AMOLED'],
  },
  {
    id: 3,
    name: 'Sony WH-1000XM5',
    category: 'Audio',
    price: 349,
    originalPrice: 399,
    rating: 4.9,
    reviews: 5420,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&q=80',
    badge: 'Top Rated',
    description: 'Industry-leading noise canceling headphones with 30-hour battery and crystal-clear call quality.',
    inStock: true,
    specs: ['30hr Battery', 'ANC', 'Multipoint Connect', 'Hi-Res Audio'],
  },
  {
    id: 4,
    name: 'MacBook Pro 14"',
    category: 'Laptops',
    price: 1999,
    originalPrice: 2199,
    rating: 4.9,
    reviews: 3102,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    badge: 'Premium',
    description: 'Supercharged by M3 Pro chip with up to 22-hour battery, Liquid Retina XDR display.',
    inStock: true,
    specs: ['M3 Pro Chip', '18GB RAM', '512GB SSD', 'Liquid Retina XDR'],
  },
];

const smartApiProxyPlugin = () => ({
  name: 'smart-api-proxy-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url || (!req.url.startsWith('/api') && !req.url.startsWith('/uploads'))) return next();

      const proxyReq = http.request(
        {
          hostname: '127.0.0.1',
          port: 5000,
          path: req.url,
          method: req.method,
          headers: req.headers,
          timeout: 5000,
        },
        (backendRes) => {
          res.writeHead(backendRes.statusCode || 200, backendRes.headers);
          backendRes.pipe(res);
        }
      );

      proxyReq.on('error', () => {
        // Backend port 5000 is down -> Serve quiet mock response without ECONNREFUSED terminal errors!
        if (res.headersSent) return;
        res.setHeader('Content-Type', 'application/json');
        if (req.url.startsWith('/api/health')) {
          res.statusCode = 200;
          return res.end(JSON.stringify({ status: 'OK', database: 'Standalone Frontend Mode' }));
        }
        if (req.url.startsWith('/api/products')) {
          res.statusCode = 200;
          return res.end(JSON.stringify(defaultProducts));
        }
        res.statusCode = 200;
        return res.end(JSON.stringify({ status: 'OK', message: 'Standalone Frontend Mode' }));
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
      });

      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        req.pipe(proxyReq);
      } else {
        proxyReq.end();
      }
    });
  },
});

export default defineConfig({
  plugins: [react(), smartApiProxyPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
});
