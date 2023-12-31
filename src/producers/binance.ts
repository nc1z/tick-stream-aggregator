import WebSocket from 'ws'
import { BINANCE_WS_BASE_ENDPOINT_FUTURES } from '../constants'
import { logTrade } from '../helpers'
import logger from '../logger'

interface BinanceStreamOptions {
    streams: string[]
    size?: number
}

interface BinanceStreamRequest {
    method: 'SUBSCRIBE' | 'UNSUBSCRIBE'
    params: string[]
    id: number
}

interface BinanceAggTradeResponse {
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
    M: boolean // Ignore
}

export class BinanceWebSocketClient {
    private readonly _options: BinanceStreamOptions
    private _ws: WebSocket

    constructor(options: BinanceStreamOptions) {
        this._options = options
        this._ws = new WebSocket(BINANCE_WS_BASE_ENDPOINT_FUTURES)

        this._ws.on('error', (error: Error) => {
            this.handleError(error)
        })

        this._ws.on('open', () => {
            this.subscribeToStreams(options.streams)
        })

        this._ws.on('message', (data: WebSocket.Data) => {
            this.handleMessage(data)
        })

        this._ws.on('close', () => {
            this.handleClose()
        })
    }

    private handleMessage(data: WebSocket.Data): void {
        const trade: BinanceAggTradeResponse = typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString())
        const price = Number(trade.p)
        const quantity = Number(trade.q)
        const size = price * quantity
        if (!this._options.size) {
            logTrade('BINANCE', price, quantity)
            return
        }
        size >= this._options.size && logTrade('BINANCE', price, quantity)
        // @TODO: Send this response back to our own websocket api
    }

    private handleClose(): void {
        this.unsubscribeFromStreams(this._options.streams)
        logger.info('WebSocket closed')
    }

    private handleError(error: Error): void {
        logger.error(error)
        logger.error('WebSocket error: ' + error.message)
    }

    private subscribeToStreams(streams: string[]): void {
        const subscriptionRequest: BinanceStreamRequest = {
            method: 'SUBSCRIBE',
            params: streams,
            id: 1,
        }

        this._ws.send(JSON.stringify(subscriptionRequest))
    }

    public unsubscribeFromStreams(streams: string[]) {
        const unsubscribeRequest: BinanceStreamRequest = {
            method: 'UNSUBSCRIBE',
            params: streams,
            id: 1,
        }
        this._ws.send(JSON.stringify(unsubscribeRequest))
    }

    public isConnected(): boolean {
        return this._ws.readyState === WebSocket.OPEN
    }

    public close() {
        if (this.isConnected()) {
            this.handleClose()
            this._ws.close()
            logger.info('Binance: connection closed.')
        } else {
            logger.warn('Websocket is not open. Unable to close.')
        }
    }
}
