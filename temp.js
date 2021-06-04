const winston = require("winston");
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      level: "error",
      filename: "filelog-error.log",
      json: true,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

logger.info("orange is the new black");
logger.error("orange is the new black. This is an error : ");
logger.warn("orange is the new black");
// logger.info("orange is the new black");
// logger.info("orange is the new black");
