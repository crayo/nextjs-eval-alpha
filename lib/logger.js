import pino from "pino";

const levels = ["fatal", "error", "warn", "info", "debug", "trace", "silent"];

let logger;

const init = () => {
  const level = levels.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : "info";
  const optsEnv = process.env.NODE_ENV === "development" ? {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      }
    }
  } : {};
  const opts = {
    level,
    ...optsEnv
  };

  logger = pino(opts);
  logger.info(`Logging initialized with level: ${level}`);
  return logger;
};

export const getLogger = childOpts => {
  if (!logger) {
    init();
  }
  return childOpts ? logger.child(childOpts) : logger;
};
