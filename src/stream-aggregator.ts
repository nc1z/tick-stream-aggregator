import findMyWay from 'find-my-way'
import http from 'http'
import { App, DISABLED, TemplatedApp } from 'uWebSockets.js'
import {
    BINANCE_WS_BASE_ENDPOINT_FUTURES,
    BITMEX_WS_BASE_ENDPOINT,
    BYBIT_WS_BASE_ENDPOINT_FUTURES,
    WS_TOPIC,
} from './constants'
import { arrayBufferToString } from './helpers'
import logger from './logger'
import { BinanceWebSocketClient } from './producers'
import { BitmexWebSocketClient } from './producers/bitmex'
import { BybitWebSocketClient } from './producers/bybit'
import { Config, Exchange } from './types'

export class StreamAggregator {
    private readonly _httpServer: http.Server
    private readonly _wsServer: TemplatedApp
    private readonly _binanceClient: BinanceWebSocketClient
    private readonly _bybitClient: BybitWebSocketClient
    private readonly _bitmexClient: BitmexWebSocketClient

    constructor(private readonly _config: Config) {
        const { path, binanceStreams, bybitStreams, bitmexStreams, size } = this._config

        const router = findMyWay({
            ignoreDuplicateSlashes: true,
            ignoreTrailingSlash: true,
        })

        this._httpServer = http.createServer((req, res) => {
            router.lookup(req, res)
        })

        this._httpServer.timeout = 0

        router.on('GET', '/', (req, res) => {
            logger.info('Incoming request: ' + req.headers.host)
            res.end('{status: "live"}')
        })

        this._wsServer = App().ws(path, {
            idleTimeout: 60,
            maxBackpressure: 1024,
            maxPayloadLength: 16 * 1024 * 1024,
            compression: DISABLED,
            open: ws => {
                const IPv6 = arrayBufferToString(ws.getRemoteAddressAsText())
                ws.subscribe(WS_TOPIC)
                logger.info(`A WebSocket connected! Path: ${IPv6}`)
            },
            message: (ws, message) => {
                let ok = ws.send(message)
                logger.info(`${ok}: ${message}`)
            },
            drain: ws => {
                logger.info('WebSocket backpressure: ' + ws.getBufferedAmount())
            },
            close: (_, code) => {
                logger.info(`[${code}] A WebSocket disconnected!`)
            },
        }) as any

        this._binanceClient = new BinanceWebSocketClient(
            {
                endpoint: BINANCE_WS_BASE_ENDPOINT_FUTURES,
                exchange: Exchange.BINANCE,
                streams: binanceStreams,
                size,
            },
            this._wsServer,
        )

        this._bybitClient = new BybitWebSocketClient(
            {
                endpoint: BYBIT_WS_BASE_ENDPOINT_FUTURES,
                exchange: Exchange.BYBIT,
                streams: bybitStreams,
                size,
            },
            this._wsServer,
        )

        this._bitmexClient = new BitmexWebSocketClient(
            {
                endpoint: BITMEX_WS_BASE_ENDPOINT,
                exchange: Exchange.BITMEX,
                streams: bitmexStreams,
                size,
            },
            this._wsServer,
        )
    }

    public async start() {
        const port = this._config.port
        const wsPort = port + 1
        await new Promise<void>((resolve, reject) => {
            try {
                this._httpServer.on('error', reject)
                this._httpServer.listen(port, () => {
                    logger.info(`Establishing connection with port ${port} ...`)
                    if (port) {
                        logger.info(`Listening to port ${port}`)
                    }
                    this._wsServer.listen(wsPort, socket => {
                        logger.info(`Establishing connection with ws port ${wsPort} ...`)
                        if (socket) {
                            logger.info(`Listening to port ${wsPort}`)
                            resolve()
                        } else {
                            reject(new Error('WebSocket server did not start'))
                        }
                    })
                })
            } catch (error) {
                reject(error)
            }
        })
    }

    public async stop() {
        this._binanceClient.close()
        this._bybitClient.close()
        this._bitmexClient.close()

        await new Promise<void>((resolve, reject) => {
            this._httpServer.close(err => {
                err ? reject(err) : resolve()
            })
        })

        logger.info('Server connection closed successfully.')
    }
}
