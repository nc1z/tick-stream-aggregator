import WebSocket from 'ws'
import { logTrade } from '../helpers'
import logger from '../logger'
import { StreamRequestMethodLowerCase } from '../types'
import { BaseWebSocketClient } from './base'
import { normalizeBybitTrade } from './mapper'

interface BybitStreamRequest {
    op: StreamRequestMethodLowerCase
    args: string[]
    req_id?: string
}

export interface BybitTradeResponse {
    topic: string
    type: string
    ts: number
    data: BybitTradeData[]
    success?: true
    ret_msg?: string
    conn_id?: string
    req_id?: string
    op?: string
}

interface BybitTradeData {
    T: number
    s: string
    S: string
    v: string
    p: string
    L: string
    i: string
    BT: boolean
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
        const { exchange, price, quantity, size, time } = trade
        if (!this._options.size || Math.abs(size) >= this._options.size) {
            console.log(trade)
            logTrade(exchange, price, quantity, time)
            this._streamAggregator.sendNormalizedTradeData(trade)
        }
    }

    protected subscribeToStreams(streams: string[]): void {
        const subscriptionRequest: BybitStreamRequest = {
            op: StreamRequestMethodLowerCase.SUBSCRIBE,
            args: streams,
        }

        this._ws?.send(JSON.stringify(subscriptionRequest))
    }

    public unsubscribeFromStreams(streams: string[]) {
        const unsubscribeRequest: BybitStreamRequest = {
            op: StreamRequestMethodLowerCase.UNSUBSCRIBE,
            args: streams,
        }
        this._ws?.send(JSON.stringify(unsubscribeRequest))
    }
}
