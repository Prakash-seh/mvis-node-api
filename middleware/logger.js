const winston = require("winston");
require("winston-mongodb");

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
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.MongoDB({
      level: "error",
      options: { useUnifiedTopology: true },
      db: "mongodb://localhost:27017/mvis",
    }),
  ],
});

module.exports = logger;
