import { logger } from './logger';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Executes an async operation with exponential backoff and jitter
 */
export async function retryWithBackoff<T>(
  operation: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelayMs = 1000,
    maxDelayMs = 8000,
    backoffFactor = 2,
    shouldRetry = () => true,
  } = options;

  let attempt = 1;
  let delay = initialDelayMs;

  while (attempt <= maxRetries) {
    try {
      return await operation(attempt);
    } catch (error) {
      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Add jitter (±20%)
      const jitter = delay * 0.2 * (Math.random() * 2 - 1);
      const actualDelay = Math.min(maxDelayMs, delay + jitter);

      logger.warn(
        `Operation failed on attempt ${attempt}. Retrying in ${Math.round(actualDelay)}ms...`,
        {
          error: error instanceof Error ? error.message : String(error),
        },
      );

      await new Promise(resolve => setTimeout(resolve, actualDelay));
      delay *= backoffFactor;
      attempt++;
    }
  }

  throw new Error('Retry exhausted');
}
