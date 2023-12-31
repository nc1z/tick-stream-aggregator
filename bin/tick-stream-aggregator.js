#!/usr/bin/env node

const { StreamAggregator } = require('../dist')
const yargs = require('yargs')
const config = require('../config')

const argv = yargs
    .option('port', {
        type: 'number',
        describe: 'Server port',
        default: config.server.port,
        alias: '-p',
    })
    .option('path', {
        type: 'string',
        describe: 'WebSocket path',
        default: config.websocket.path,
    })
    .option('binanceStreams', {
        type: 'array',
        describe: 'Binance streams',
        default: config.filters.binance.streams,
    })
    .option('bybitStreams', {
        type: 'array',
        describe: 'Bybit streams',
        default: config.filters.bybit.streams,
    })
    .option('bitmexStreams', {
        type: 'array',
        describe: 'Bitmex streams',
        default: config.filters.bitmex.streams,
    })
    .option('size', {
        type: 'number',
        describe: 'Filter by size (USD)',
        default: config.filters.size,
        alias: '-s',
    }).argv

async function start() {
    const server = new StreamAggregator(argv)
    await server.start(argv.port)

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
