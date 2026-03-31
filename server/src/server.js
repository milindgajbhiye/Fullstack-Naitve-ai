import express from 'express';
import cors from 'cors';
import docsRouter from './routes/docs.js';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 5000;

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request validation middleware
app.use((req, res, next) => {
  if (req.body && Object.keys(req.body).length > 0) {
    if (req.body.title !== undefined && typeof req.body.title !== 'string') {
      return res.status(400).json({ error: 'Invalid title format' });
    }
    if (req.body.content !== undefined && typeof req.body.content !== 'string') {
      return res.status(400).json({ error: 'Invalid content format' });
    }
  }
  next();
});

// Routes
app.use('/api/docs', docsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handling
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`, err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  app.listen(PORT, () => {
    console.log(`\n✓ Server running on http://localhost:${PORT}`);
    console.log(`✓ API available at http://localhost:${PORT}/api/docs`);
  });
}

export default app;
