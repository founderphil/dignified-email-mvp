/**
 * Lightweight policy/guardrails. Expand for enterprise rules.
 */
export type PolicyConfig = {
  bannedPhrases?: string[];
  disclaimers?: string[];
  toneDefault?: 'formal' | 'warm' | 'neutral' | 'brief';
  maxChars?: number;
};

export const defaultPolicy: PolicyConfig = {
  bannedPhrases: [
    'guarantee',
    'I promise',
    'binding commitment',
    'confidential unless otherwise stated'
  ],
  disclaimers: [],
  toneDefault: 'formal',
  maxChars: 2000
};

export function enforcePolicy(text: string, cfg: PolicyConfig = defaultPolicy) {
  let output = text;
  if (cfg.maxChars && output.length > cfg.maxChars) {
    output = output.slice(0, cfg.maxChars) + '…';
  }
  if (cfg.bannedPhrases?.some(p => output.toLowerCase().includes(p.toLowerCase()))) {
    output = output.replace(/guarantee|I promise|binding commitment/gi, '[redacted]');
  }
  if (cfg.disclaimers && cfg.disclaimers.length) {
    output += `\n\n${cfg.disclaimers.join(' ')}`;
  }
  return output;
}
