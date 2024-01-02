export interface Config {
    port: number
    path: string
    reconnectionInterval: number
    reconnectionAttempts: number
    binanceStreams: string[]
    bybitStreams: string[]
    bitmexStreams: string[]
    disabledExchanges: Exchange[]
    size: number
}

export enum Exchange {
    BINANCE = 'BINANCE',
    BYBIT = 'BYBIT',
    BITMEX = 'BITMEX',
}

export enum StreamRequestMethod {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
    subscribe = 'subscribe',
    unsubscribe = 'unsubscribe',
}

export enum Side {
    BUY = 'BUY',
    SELL = 'SELL',
}

export interface NormalizedTradeData {
    side: Side
    exchange: Exchange
    price: number
    quantity: number
    size: number
    time: number
}
