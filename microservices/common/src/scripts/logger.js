const winston = require('winston')
require('winston-daily-rotate-file');

dateFormat = () => {
  return new Date(Date.now()).toUTCString()
}

var transport = new (winston.transports.DailyRotateFile)({
  filename: 'LogFiles/CC-Common-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '1m',
  maxFiles: '15d'
});

transport.on('rotate', function (oldFilename, newFilename) {
});

this.log_data = null

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '../../LogFiles/logfile.log'
    })
  ],
  format: winston.format.printf((info) => {
    let message = `[ ${dateFormat()} ] | [ ${info.level.toUpperCase()} ] | [ ${info.message} ] `
    return message
  })
});

module.exports = logger