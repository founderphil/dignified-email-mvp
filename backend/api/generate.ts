import express from 'express';
import serverless from 'serverless-http';
import { router as generateRouter } from '../src/routes/generate.js';

const app = express();
app.use(express.json({ limit: '512kb' }));

app.use('/', (req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

app.use('/', generateRouter);

export default serverless(app);

// filepath: /Volumes/T7 Shield/dignified-email-mvp/backend/src/routes/generate.ts
router.post('/', async (req, res) => {
  console.log('generate called with:', req.body);
  try {
    // Validate input
    const data = GenSchema.parse(req.body);
    const prompt = buildPrompt(data);
    console.log('Prompt built:', prompt);

    // Call OpenAI
    console.log('Calling OpenAI...');
    const result = await complete(prompt);
    console.log('OpenAI result:', result);

    res.json(result);
  } catch (e: any) {
    console.error('Error in /v1/generate:', e);
    res.status(400).json({ error: e.message || 'Unknown error' });
  }
});