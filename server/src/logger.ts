import winston from 'winston';
import config from './config';

const developmetFormat = winston.format.printf( ({ level, message, timestamp , ...metadata}) => {
  return `${timestamp} [${level}] : ${message} ${JSON.stringify(metadata)}`;
});

const transports = [];
if(process.env.NODE_ENV !== 'development') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
      )
    })
  )
} else {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.colorize({ colors: { info: 'green' }}),
        winston.format.splat(),
        developmetFormat,
      )
    })
  )
}

const LoggerInstance = winston.createLogger({
  level: config.log.level,
  levels: winston.config.npm.levels,
  transports
});

export default LoggerInstance;
