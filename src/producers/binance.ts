import WebSocket from 'ws'
import { logTrade } from '../helpers'
import { StreamRequestMethod } from '../types'
import { BaseWebSocketClient } from './base'
import { normalizeBinanceTrade } from './mapper'

interface BinanceStreamRequest {
    method: StreamRequestMethod
    params: string[]
    id: number
}

export interface BinanceAggTradeResponse {
    e: string // Event type
    E: number // Event time
    s: string // Symbol
    a: number // Aggregate trade ID
    p: string // Price
    q: string // Quantity
    f: number // First trade ID
    l: number // Last trade ID
    T: number // Trade time
    m: boolean // Is the buyer the market maker?
    M?: boolean // Ignore
}

export class BinanceWebSocketClient extends BaseWebSocketClient {
    protected handleMessage(data: WebSocket.Data): void {
        const response: BinanceAggTradeResponse =
            typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString())
        const trade = normalizeBinanceTrade(response)
        const { exchange, price, quantity, size, time } = trade
        if (!this._options.size || size >= this._options.size) {
            logTrade(exchange, price, quantity, time)
            this._streamAggregator.sendNormalizedTradeData(trade)
        }
    }

    protected subscribeToStreams(streams: string[]): void {
        const subscriptionRequest: BinanceStreamRequest = {
            method: StreamRequestMethod.SUBSCRIBE,
            params: streams,
            id: 1,
        }

        this._ws?.send(JSON.stringify(subscriptionRequest))
    }

    public unsubscribeFromStreams(streams: string[]) {
        const unsubscribeRequest: BinanceStreamRequest = {
            method: StreamRequestMethod.UNSUBSCRIBE,
            params: streams,
            id: 1,
        }
        this._ws?.send(JSON.stringify(unsubscribeRequest))
    }
}
