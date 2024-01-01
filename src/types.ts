export interface Config {
    port: number
    path: string
    reconnectionInterval: number
    reconnectionAttempts: number
    binanceStreams: string[]
    bybitStreams: string[]
    size: number
}

export enum Exchange {
    BINANCE = 'BINANCE',
    BYBIT = 'BYBIT',
}

export enum StreamRequestMethod {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export enum StreamRequestMethodLowerCase {
    SUBSCRIBE = 'subscribe',
    UNSUBSCRIBE = 'unsubscribe',
}

export interface NormalizedTradeData {
    exchange: Exchange
    price: number
    quantity: number
    size: number
    time: number
}
