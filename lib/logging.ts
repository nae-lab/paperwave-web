import { createConsola, LogLevels } from "consola";

export const consola = createConsola({
  level: LogLevels.info,
  formatOptions: {
    colors: true,
  },
});

async function setupConsola() {
  consola.wrapConsole();
  // Set log level from envvar
  const logType = process.env.LOG_LEVEL;

  if (logType) {
    let logLevel;

    switch (logType) {
      case "silent":
        logLevel = LogLevels.silent;
        break;
      case "trace":
        logLevel = LogLevels.trace;
        break;
      case "debug":
        logLevel = LogLevels.debug;
        break;
      case "info":
        logLevel = LogLevels.info;
        break;
      case "warn":
        logLevel = LogLevels.warn;
        break;
      case "error":
        logLevel = LogLevels.error;
        break;
      case "fatal":
        logLevel = LogLevels.fatal;
        break;
      default:
        logLevel = LogLevels.info;
    }

    consola.level = logLevel;
  }
}

setupConsola();
