import WebSocket from 'ws'
import { logTrade } from '../helpers'
import logger from '../logger'
import { StreamRequestMethod } from '../types'
import { BaseWebSocketClient } from './base'
import { normalizeBybitTrade } from './mapper'

interface BybitStreamRequest {
    op: StreamRequestMethod
    args: string[]
    req_id?: string
}

interface SubResponse {
    success?: true
    ret_msg?: string
    conn_id?: string
    req_id?: string
    op?: string
}

export interface BybitTradeResponse extends SubResponse {
    topic: string
    type: string
    ts: number
    data: BybitTradeData[]
}

interface BybitTradeData {
    T: number // The timestamp (ms) that the order is filled
    s: string // Symbol name
    S: string // Side of taker Buy/Sell
    v: string // Trade size
    p: string // Trade price
    L: string // Direction of price change
    i: string // Trade ID
    BT: boolean // Whether it is a block trade order or not
}

// @TODO: Bybit docs: To avoid network or program issues, we recommend that you send
// the ping heartbeat packet every 20 seconds to maintain the WebSocket connection.

export class BybitWebSocketClient extends BaseWebSocketClient {
    protected handleMessage(data: WebSocket.Data): void {
        const response: BybitTradeResponse = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString())

        if (response?.success) {
            logger.info('Successful connection to Bybit WebSocket')
            return
        }

        const trade = normalizeBybitTrade(response)
        const { exchange, price, size, side, time } = trade

        if (!this._options.size || Math.abs(size) >= this._options.size) {
            logTrade(exchange, price, size, side, time)
            this.sendNormalizedTradeData(trade)
        }
    }

    protected subscribeToStreams(streams: string[]): void {
        const subscriptionRequest: BybitStreamRequest = {
            op: StreamRequestMethod.subscribe,
            args: streams,
        }

        this._ws?.send(JSON.stringify(subscriptionRequest))
    }

    public unsubscribeFromStreams(streams: string[]) {
        const unsubscribeRequest: BybitStreamRequest = {
            op: StreamRequestMethod.unsubscribe,
            args: streams,
        }
        this._ws?.send(JSON.stringify(unsubscribeRequest))
    }
}
