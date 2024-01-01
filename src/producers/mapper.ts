import { Exchange, NormalizedTradeData } from '../types'
import { BinanceAggTradeResponse } from './binance'

export function normalizeBinanceTrade(trade: BinanceAggTradeResponse): NormalizedTradeData {
    return {
        exchange: Exchange.BINANCE,
        price: Number(trade.p),
        quantity: Number(trade.q),
        size: Number(trade.p) * Number(trade.q),
        time: trade.T,
    }
}
