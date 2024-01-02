import WebSocket from 'ws'
import { logTrade } from '../helpers'
import logger from '../logger'
import { StreamRequestMethod } from '../types'
import { BaseWebSocketClient } from './base'
import { normalizeBitmexTrade } from './mapper'

interface BitmexStreamRequest {
    op: StreamRequestMethod
    args: string[]
}

interface Limit {
    remaining: number
}

interface SubResponse {
    success?: true
    info?: string
    limit?: Limit
    error?: string
}

export interface BitmexTradeResponse extends SubResponse {
    table: string
    action: string
    data: BitmexTradeData[]
}

interface BitmexTradeData {
    timestamp: string
    symbol: string
    side: string
    size: number
    price: number
    tickDirection: string
    trdMatchID: string
    grossValue: number
    homeNotional: number
    foreignNotional: number
    trdType: string
}

export class BitmexWebSocketClient extends BaseWebSocketClient {
    protected handleMessage(data: WebSocket.Data): void {
        const response: BitmexTradeResponse = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString())

        if (!!response.info) {
            logger.info(`BITMEX: connections ${response.limit?.remaining}`)
            return
        }

        if (response.success) {
            logger.info('Successful connection to Bitmex WebSocket')
            return
        }

        if (response.error) {
            logger.error(response.error)
            return
        }

        if (!response.data) {
            return
        }

        const trade = normalizeBitmexTrade(response)
        const { exchange, price, size, side, time } = trade

        if (!this._options.size || Math.abs(size) >= this._options.size) {
            logTrade(exchange, price, size, side, time)
            this.sendNormalizedTradeData(trade)
        }
    }

    protected subscribeToStreams(streams: string[]): void {
        const subscriptionRequest: BitmexStreamRequest = {
            op: StreamRequestMethod.SUBSCRIBE,
            args: streams,
        }

        this._ws?.send(JSON.stringify(subscriptionRequest))
    }

    public unsubscribeFromStreams(streams: string[]) {
        const unsubscribeRequest: BitmexStreamRequest = {
            op: StreamRequestMethod.UNSUBSCRIBE,
            args: streams,
        }
        this._ws?.send(JSON.stringify(unsubscribeRequest))
    }
}
