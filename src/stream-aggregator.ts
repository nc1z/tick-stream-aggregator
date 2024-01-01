import findMyWay from 'find-my-way'
import http from 'http'
import { App, DISABLED, TemplatedApp } from 'uWebSockets.js'
import { BINANCE_STREAMS, MINIMUM_SIZE_FILTER, WS_TOPIC } from './constants'
import { arrayBufferToString } from './helpers'
import logger from './logger'
import { BinanceWebSocketClient } from './producers'
import { Config, NormalizedTradeData } from './types'

export class StreamAggregator {
    private readonly _httpServer: http.Server
    private readonly _wsServer: TemplatedApp
    private readonly _binanceClient: BinanceWebSocketClient

    constructor(private readonly config: Config) {
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
            res.end('{message: "hello world"}')
        })

        this._wsServer = App().ws('/*', {
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
                streams: BINANCE_STREAMS,
                size: MINIMUM_SIZE_FILTER,
            },
            this,
        )
    }

    public async start(port: number) {
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

        await new Promise<void>((resolve, reject) => {
            this._httpServer.close(err => {
                err ? reject(err) : resolve()
            })
        })

        logger.info('Server connection closed successfully.')
    }

    public sendNormalizedTradeData(data: NormalizedTradeData) {
        const message = JSON.stringify(data)
        this._wsServer.publish(WS_TOPIC, message)
    }
}
