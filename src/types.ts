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
