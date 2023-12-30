import http from 'http'
import findMyWay from 'find-my-way'
import { App, DISABLED, TemplatedApp } from 'uWebSockets.js'

export class StreamAggregator {
    private readonly _httpServer: http.Server
    private readonly _wsServer: TemplatedApp

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
            const response = {
                request: req,
                message: 'hello world',
            }
            res.end(JSON.stringify(response, null, 2))
        })

        this._wsServer = App().ws('/*', {
            idleTimeout: 60,
            maxBackpressure: 1024,
            maxPayloadLength: 16 * 1024 * 1024,
            compression: DISABLED,

            open: (ws: any) => {
                const path = ws.req.getUrl().toLocaleLowerCase()
                ws.closed = false
                console.log('A WebSocket connected! Path: ' + path)
            },

            message: (ws, message) => {
                let ok = ws.send(message)
                console.log('ok? ' + ok)
            },

            drain: ws => {
                console.log('WebSocket backpressure: ' + ws.getBufferedAmount())
            },

            close: (ws: any) => {
                ws.closed = true
                if (ws.onclose !== undefined) {
                    ws.onclose()
                }
            },
        }) as any
    }

    public async start(port: number) {
        console.log(this.config)

        await new Promise<void>((resolve, reject) => {
            this._httpServer.on('error', reject)
            this._httpServer.listen(port || 8080, () => {
                this._wsServer.listen(port + 1 || 8081, port => {
                    if (port) {
                        console.log('Listening to port: ' + port)
                        resolve()
                    } else {
                        reject(new Error('WebSocket server did not start'))
                    }
                })
            })
        })
    }

    public async stop() {
        await new Promise<void>((resolve, reject) => {
            this._httpServer.close(err => {
                err ? reject(err) : resolve()
            })
        })
    }
}

interface Config {
    apiKey?: string
}
