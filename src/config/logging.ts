import * as winston from 'winston';
import * as logger from './defaultLogger';
const { combine, simple, colorize, json } = winston.format;

export default function initializeLogger() {
  logger.setDefaultLogger(
    winston.createLogger({
      level: 'info',
      format: json(),
      // defaultMeta: { service: 'user-service' },
      transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
      ],
    }),
  );

  //
  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  //
  if (process.env.NODE_ENV !== 'production') {
    // log.add(new winston.transports.Console({ level: 'info' }));
    log.add(
      new winston.transports.Console({
        format: combine(colorize(), simple()),
      }),
    );
  }
}
