import express from 'express';
import serverless from 'serverless-http';
import { router as generateRouter } from '../src/routes/generate.js';

const app = express();
app.use(express.json({ limit: '512kb' }));

// Optional: log incoming requests for debugging
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

// Mount the generate router at the root
app.use('/', generateRouter);

export default serverless(app);