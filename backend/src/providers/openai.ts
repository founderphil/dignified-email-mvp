import fetch from 'node-fetch';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// Placeholder for an OpenAI provider (no external call here to keep this skeleton self-contained).
export async function complete(prompt: string) {
  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful email assistant.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 512,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Simple extraction: expect "Subject: ...\nBody: ..." in the response
  const subjectMatch = content.match(/Subject:(.*)/i);
  const bodyMatch = content.match(/Body:(.*)/is);

  return {
    subject: subjectMatch ? subjectMatch[1].trim() : 'Re: follow-up',
    body: bodyMatch ? bodyMatch[1].trim() : content.trim()
  };
}
