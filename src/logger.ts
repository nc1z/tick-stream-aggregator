import pino from 'pino'

const loggerOptions: pino.LoggerOptions = {
    level: 'info', // default log level
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: false,
        },
    },
    base: undefined, // Removes PID and hostname
    timestamp: false,
}

const logger = pino(loggerOptions)

export default logger
