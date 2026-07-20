import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { Generators } from './server/generators';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Enable CORS manually for development ease
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Log API requests
  app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/generate/')) {
      console.log(`[API Request] ${req.method} ${req.path}`);
    }
    next();
  });

  // ==========================================
  // SPECIFIC / SHORT GET ENDPOINTS
  // ==========================================
  const directRoutes: Record<string, () => any> = {
    'user': Generators.user,
    'company': Generators.company,
    'address': Generators.address,
    'phone': Generators.phone,
    'email': Generators.email,
    'username': Generators.username,
    'password': () => Generators.password(16),
    'country': Generators.country,
    'state': Generators.state,
    'city': Generators.city,
    'postal': Generators.postal,
    'job': Generators.job,
    'profile': Generators.profile,
  };

  // Register user endpoints under both /generate and /api/generate
  Object.entries(directRoutes).forEach(([key, generatorFn]) => {
    const handler = (req: express.Request, res: express.Response) => {
      try {
        const data = generatorFn();
        res.json(data);
      } catch (err: any) {
        res.status(500).json({ error: err.message || 'Generation failed' });
      }
    };
    app.get(`/generate/${key}`, handler);
    app.get(`/api/generate/${key}`, handler);
  });

  // Short aliases requested by user
  app.get('/generate/sql', (req, res) => res.json(Generators.security('sql')));
  app.get('/api/generate/sql', (req, res) => res.json(Generators.security('sql')));

  app.get('/generate/xss', (req, res) => res.json(Generators.security('xss')));
  app.get('/api/generate/xss', (req, res) => res.json(Generators.security('xss')));

  app.get('/generate/json', (req, res) => res.json(Generators.api('json')));
  app.get('/api/generate/json', (req, res) => res.json(Generators.api('json')));

  app.get('/generate/uuid', (req, res) => res.json(Generators.dev('uuid')));
  app.get('/api/generate/uuid', (req, res) => res.json(Generators.dev('uuid')));

  app.get('/generate/hash', (req, res) => res.json(Generators.dev('sha256', req.query.param as string)));
  app.get('/api/generate/hash', (req, res) => res.json(Generators.dev('sha256', req.query.param as string)));

  app.get('/generate/ip', (req, res) => res.json(Generators.network('ipv4')));
  app.get('/api/generate/ip', (req, res) => res.json(Generators.network('ipv4')));

  app.get('/generate/card', (req, res) => res.json(Generators.payment('visa')));
  app.get('/api/generate/card', (req, res) => res.json(Generators.payment('visa')));

  // String with customizable length
  const stringHandler = (req: express.Request, res: express.Response) => {
    const length = parseInt(req.params.length) || 10;
    if (length > 1000000) {
      return res.status(400).json({ error: 'Length is too large. Maximum supported is 1,000,000 characters.' });
    }
    const char = (req.query.char as string) || 'A';
    const value = char.repeat(length);
    res.json({
      value,
      length,
      character: char,
      description: `Custom length boundary test string (${length} chars)`
    });
  };
  app.get('/generate/string/:length', stringHandler);
  app.get('/api/generate/string/:length', stringHandler);

  // ==========================================
  // CATEGORIZED ROUTING
  // ==========================================
  // e.g. GET /api/generate/boundary/char100
  // e.g. GET /api/generate/security/sql
  // e.g. GET /api/generate/api/xml
  // e.g. GET /api/generate/payment/iban
  // e.g. GET /api/generate/network/ipv6
  // e.g. GET /api/generate/datetime/leap
  // e.g. GET /api/generate/dev/jwt

  const categoryHandler = (req: express.Request, res: express.Response) => {
    const { category, type } = req.params;
    try {
      let result: any;
      switch (category) {
        case 'boundary':
          result = Generators.boundary(type);
          break;
        case 'security':
          result = Generators.security(type);
          break;
        case 'api':
          result = Generators.api(type);
          break;
        case 'payment':
          result = Generators.payment(type);
          break;
        case 'network':
          result = Generators.network(type);
          break;
        case 'datetime':
          result = Generators.datetime(type);
          break;
        case 'dev':
          result = Generators.dev(type, req.query.param as string);
          break;
        default:
          return res.status(400).json({ error: `Unknown category: ${category}` });
      }

      if (result && result.error) {
        return res.status(400).json(result);
      }
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Generation failed' });
    }
  };

  app.get('/api/generate/:category/:type', categoryHandler);
  app.get('/generate/:category/:type', categoryHandler);

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // VITE OR STATIC MIDDLEWARE
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
