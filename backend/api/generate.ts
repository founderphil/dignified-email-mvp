import express from 'express';
import serverless from 'serverless-http';
import { router as generateRouter } from '../src/routes/generate.js';

const app = express();
app.use(express.json({ limit: '512kb' }));
app.use('/', generateRouter);

export default serverless(app);