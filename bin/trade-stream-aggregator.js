#!/usr/bin/env node

const { StreamAggregator } = require('../dist')

const PORT = 8080

async function start() {
    const server = new StreamAggregator()
    await server.start(PORT)
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
