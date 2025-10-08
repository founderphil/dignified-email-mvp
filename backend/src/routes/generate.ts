import { Router } from 'express';
import { z } from 'zod';
import { buildPrompt } from '../prompt.js';
import { enforcePolicy, defaultPolicy } from '../policy.js';
// Swap providers here:
import { complete } from '../providers/openai.js';
// import { complete } from '../providers/mock.js';

export const router = Router();

const GenSchema = z.object({
  userDisplayName: z.string().min(1),
  tone: z.enum(['formal','warm','neutral','brief']).optional(),
  purpose: z.string().min(1),
  keyPoints: z.array(z.string()).min(1),
  recipientName: z.string().optional(),
  companyStyle: z.string().optional(),
  threadSummary: z.string().optional()
});

router.post('/', async (req, res) => {
  console.log('generate called with:', req.body);
  try {
    const data = GenSchema.parse(req.body);
    const prompt = buildPrompt(data);
    console.log('Calling OpenAI...');
    const result = await complete(prompt);
    console.log('OpenAI result:', result);
    const safeBody = enforcePolicy(result.body, defaultPolicy);
    res.json({ subject: result.subject, body: safeBody });
  } catch (e: any) {
    console.error('Error in /v1/generate:', e);
    res.status(400).json({ error: e.message || 'Unknown error' });
  }
});
