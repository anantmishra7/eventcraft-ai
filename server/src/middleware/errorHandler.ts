import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

/**
 * Centralized error-handling middleware
 * Ensures stack traces and sensitive server paths are never leaked to clients.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  // Handle Zod schema validation errors
  if (err instanceof ZodError) {
    logger.warn('Zod request validation failed', {
      path: req.path,
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message })),
    });

    res.status(400).json({
      success: false,
      error: 'Validation failed for request data',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle standard HTTP / Runtime errors
  const status =
    typeof (err as { status?: number })?.status === 'number'
      ? (err as { status: number }).status
      : 500;

  const errorMessage = err instanceof Error ? err.message : 'An unexpected internal error occurred';

  logger.error(`Unhandled error at ${req.method} ${req.path}`, err);

  res.status(status).json({
    success: false,
    error: status === 500 ? 'Internal server error. Please try again later.' : errorMessage,
  });
}
