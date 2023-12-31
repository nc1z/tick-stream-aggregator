#!/usr/bin/env node

const { StreamAggregator } = require('../dist')

const PORT = 8080

async function start() {
    const server = new StreamAggregator()
    await server.start(PORT)

    async function handleTermination(signal) {
        console.log(`Received ${signal}. Cleaning up...`)
        await server.stop()
        process.exit()
    }

    process.on('SIGINT', () => handleTermination('SIGINT'))
    process.on('SIGTERM', () => handleTermination('SIGTERM'))
}

start()

process
    .on('unhandledRejection', (reason, p) => {
        console.error('Unhandled Rejection at Promise', reason, p)
    })
    .on('uncaughtException', err => {
        console.error('Uncaught Exception thrown', err)
        process.exit(1)
    })
