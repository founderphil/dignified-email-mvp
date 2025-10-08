type Tone = 'formal' | 'warm' | 'neutral' | 'brief';

export type PromptInput = {
  userDisplayName: string;
  tone?: Tone;
  purpose: string;     // e.g., 'follow-up', 'intro', 'apology'
  keyPoints: string[]; // bullet points user wants included
  recipientName?: string;
  companyStyle?: string; // optional style hints per tenant
  threadSummary?: string; // short summary instead of raw thread
};

export function buildPrompt({
  userDisplayName,
  tone = 'neutral',
  purpose,
  keyPoints,
  recipientName,
  companyStyle,
  threadSummary
}: {
  userDisplayName: string;
  tone?: string;
  purpose: string;
  keyPoints: string[];
  recipientName?: string;
  companyStyle?: string;
  threadSummary?: string;
}) {
  return `
You are an expert email assistant helping users communicate with dignity and empathy.
Purpose: ${purpose}
Tone: ${tone}
Key Points: ${keyPoints.join(', ')}
${recipientName ? `Recipient: ${recipientName}` : ''}
${companyStyle ? `Company Style: ${companyStyle}` : ''}
${threadSummary ? `Thread Summary: ${threadSummary}` : ''}

Generate a subject and a body for an email that is clear, respectful, and maintains dignity for both sender and recipient. If declining or turning down a request, do so with empathy and clarity.
`;
}
