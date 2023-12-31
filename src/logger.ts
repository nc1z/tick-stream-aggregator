import pino from 'pino'

const loggerOptions: pino.LoggerOptions = {
    level: 'info', // default log level
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
        },
    },
    base: undefined, // Removes PID and hostname
}

const logger = pino(loggerOptions)

export default logger
