import logger from './logger'

export function logTrade(exchange: string, price: number, quantity: number): string {
    const size = price * quantity
    let formattedSize: string
    switch (true) {
        case size >= 1e6:
            formattedSize = (size / 1e6).toFixed(1) + 'M'
            break
        case size >= 1e3:
            formattedSize = (size / 1e3).toFixed(1) + 'K'
            break
        default:
            formattedSize = size.toFixed(2)
            break
    }

    const log = `[${exchange}] ${price.toFixed(0)} [${formattedSize}]`
    logger.info(`[${exchange}] ${price.toFixed(0)} [${formattedSize}]`)
    return log
}
