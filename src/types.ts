export interface Config {
    apiKey?: string
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
