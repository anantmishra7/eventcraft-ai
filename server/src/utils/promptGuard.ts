/**
 * Security Prompt Injection Guard & Input Sanitizer
 * Protects GenAI endpoints against jailbreaking, control-flow hijacking, and system prompt leakage.
 */

// Patterns commonly associated with prompt injection, role confusion, and delimiter breaking
const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts)/gi,
  /disregard\s+(all\s+)?(previous|prior|above)/gi,
  /you\s+are\s+now\s+in\s+developer\s+mode/gi,
  /system\s+override/gi,
  /reveal\s+(your\s+)?(system\s+prompt|instructions|initial\s+prompt)/gi,
  /<\|im_start\|>/gi,
  /<\|im_end\|>/gi,
  /\[INST\]/gi,
  /\[\/INST\]/gi,
  /<<SYS>>/gi,
  /<<\/SYS>>/gi,
];

/**
 * Sanitizes user-provided string to prevent prompt injection and delimiter breaking
 *
 * @param input Raw user input string
 * @param maxLength Maximum allowed length
 * @returns Cleaned and truncated string
 */
export function sanitizePromptInput(input: unknown, maxLength = 500): string {
  if (typeof input !== 'string') {
    return '';
  }

  // 1. Trim and clamp max length
  let sanitized = input.trim().slice(0, maxLength);

  // 2. Remove or neutralize injection patterns
  for (const pattern of INJECTION_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[FILTERED]');
  }

  // 3. Neutralize delimiter sequences that mimic system boundary tokens
  sanitized = sanitized
    .replace(/<<</g, '«««')
    .replace(/>>>/g, '»»»')
    .replace(/```json/gi, '`json`')
    .replace(/```/g, "'''");

  return sanitized;
}

/**
 * Wraps user data into safely bounded XML/Markdown blocks with explicit strict parsing context
 */
export function formatSafeDataBlock(tag: string, data: unknown): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return `\n<<<DATA_BLOCK:${tag}>>>\n${content}\n<<</DATA_BLOCK:${tag}>>>\n`;
}
