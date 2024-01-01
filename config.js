module.exports = {
    server: {
        port: 8080,
    },
    websocket: {
        path: '/*',
    },
    binance: {
        streams: ['btcusdt@aggTrade'],
        size: 100000,
    },
}
