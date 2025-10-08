import express from 'express';
import { router as generateRouter } from '../src/routes/generate.js';
import serverless from 'serverless-http';

const app = express();
app.use(express.json({ limit: '512kb' }));
app.use('/v1/generate', generateRouter);

export default serverless(app);