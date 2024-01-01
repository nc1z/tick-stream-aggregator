export interface Config {
    port: number
    path: string
    reconnectionInterval: number
    reconnectionAttempts: number
    binanceStreams: string[]
    size: number
}

export enum Exchange {
    BINANCE = 'BINANCE',
}

export enum StreamRequestMethod {
    SUBSCRIBE = 'SUBSCRIBE',
    UNSUBSCRIBE = 'UNSUBSCRIBE',
}

export interface NormalizedTradeData {
    exchange: Exchange
    price: number
    quantity: number
    size: number
    time: number
}
