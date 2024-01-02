module.exports = {
    server: {
        port: 8080,
    },
    websocket: {
        path: '/*',
    },
    filters: {
        size: 100000,
        binance: {
            streams: ['btcusdt@aggTrade'],
        },
        bybit: {
            streams: ['publicTrade.BTCUSDT'],
        },
        bitmex: {
            streams: ['trade:XBTUSD'],
        },
    },
}
