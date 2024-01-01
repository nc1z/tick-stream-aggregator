import WebSocket from 'ws'
import { RECONNECTION_ATTEMPT_LIMIT, RECONNECTION_INTERVAL } from '../constants'
import logger from '../logger'
import { StreamAggregator } from '../stream-aggregator'
import { Exchange } from '../types'

interface StreamOptions {
    endpoint: string
    exchange: Exchange
    streams: string[]
    size?: number
}

export abstract class BaseWebSocketClient<TStreamOptions extends StreamOptions = StreamOptions> {
    private readonly _reconnectionInterval: number
    protected readonly _options: TStreamOptions
    protected readonly _streamAggregator: StreamAggregator
    protected _ws?: WebSocket
    private _reconnectionAttempts: number

    constructor(options: TStreamOptions, streamAggregator: StreamAggregator) {
        this._options = options
        this._streamAggregator = streamAggregator
        this._reconnectionInterval = RECONNECTION_INTERVAL
        this._reconnectionAttempts = 0
        this.connect()
    }

    private connect() {
        this._ws = new WebSocket(this._options.endpoint)

        this._ws.on('error', (error: Error) => {
            this.handleError(error)
        })

        this._ws.on('open', () => {
            this.subscribeToStreams(this._options.streams)
        })

        this._ws.on('message', (data: WebSocket.Data) => {
            this.handleMessage(data)
        })

        this._ws.on('close', () => {
            this.handleClose()
            this.scheduleReconnect()
        })
    }

    private scheduleReconnect() {
        if (this._reconnectionAttempts < RECONNECTION_ATTEMPT_LIMIT) {
            logger.info(`${this._options.exchange}: Scheduling reconnection...`)
            setTimeout(() => {
                this._reconnectionAttempts++
                this.connect()
            }, this._reconnectionInterval)
        } else {
            logger.error(`${this._options.exchange}: Exceeded maximum reconnection attempts.`)
        }
    }

    private handleClose(): void {
        this.unsubscribeFromStreams(this._options.streams)
        logger.info(`${this._options.exchange}: WebSocket closed`)
    }

    private handleError(error: Error): void {
        logger.error(error)
        logger.error(`${this._options.exchange}: WebSocket error: ${error.message}`)
    }

    protected abstract handleMessage(data: WebSocket.Data): void
    protected abstract subscribeToStreams(streams: string[]): void
    protected abstract unsubscribeFromStreams(streams: string[]): void

    public isConnected(): boolean {
        return this._ws?.readyState === WebSocket.OPEN
    }

    public close() {
        if (this.isConnected()) {
            this.handleClose()
            this._ws?.close()
            logger.info(`${this._options.exchange}: connection closed.`)
        } else {
            logger.warn(`${this._options.exchange}: Websocket is not open. Unable to close.`)
        }
    }
}
