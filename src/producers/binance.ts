import WebSocket from 'ws'
import { logTrade } from '../helpers'
import logger from '../logger'
import { StreamRequestMethod } from '../types'
import { BaseWebSocketClient } from './base'
import { normalizeBinanceTrade } from './mapper'

interface BinanceStreamRequest {
    method: StreamRequestMethod
    params: string[]
    id: number
}

interface SubResponse {
    result?: null
    id?: number
}

export interface BinanceAggTradeResponse extends SubResponse {
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

        if (response?.result === null) {
            logger.info('Successful connection to Binance WebSocket')
            return
        }

        const trade = normalizeBinanceTrade(response)
        const { exchange, price, size, side, time } = trade

        if (!this._options.size || Math.abs(size) >= this._options.size) {
            logTrade(exchange, price, size, side, time)
            this.sendNormalizedTradeData(trade)
        }
    }

    protected async subscribeToStreams(streams: string[]): Promise<void> {
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
