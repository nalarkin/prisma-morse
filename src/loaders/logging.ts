/**
 * Creates a unified logger for all codebase. Outputs the logs to `error.log`
 * and `combined.log` files.
 *
 * It is prefered to import this module for logging statements, rather than the
 * builtin console.log() because the console.log() slows down performance of server,
 * and offers less customizability.
 */
import * as winston from 'winston';
const { combine, simple, colorize, json } = winston.format;

export const logger = winston.createLogger({
  level: 'info',
  format: json(),
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // - Write all logs with level `info` and below to `combined.log`
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: combine(colorize(), simple()),
      level: 'info',
    }),
  );
}
