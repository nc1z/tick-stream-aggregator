import logger from './logger'
import { Exchange } from './types'

export function logTrade(exchange: Exchange, price: number, quantity: number, time: number) {
    const size = price * quantity
    let formattedSize: string
    switch (true) {
        case size >= 1e6:
            formattedSize = (size / 1e6).toFixed(1) + 'M'
            break
        case size >= 1e2:
            formattedSize = (size / 1e3).toFixed(1) + 'K'
            break
        default:
            formattedSize = (size / 1e3).toFixed(2) + 'K'
            break
    }
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }
    const currentTime = new Date(time).toLocaleTimeString(undefined, options)
    const log = `[${currentTime}] [${exchange}] ${price.toFixed(0)} [${formattedSize}]`
    logger.info(log)
}
