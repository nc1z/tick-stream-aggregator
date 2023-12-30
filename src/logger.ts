import pino from 'pino'

const loggerOptions: pino.LoggerOptions = {
    level: 'info', // Set the default log level
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
}

const logger = pino(loggerOptions)

export default logger
