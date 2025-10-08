import 'dotenv/config';
import express from 'express';
import { router as generateRouter } from './routes/generate.js';

const app = express();
app.use(express.json({ limit: '512kb' }));

app.get('/healthz', (_req, res) => res.json({ ok: true }));

app.use('/v1/generate', generateRouter);

// basic error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error('Error:', err);
  res.status(400).json({ error: err.message || 'Unknown error' });
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
