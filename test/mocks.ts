import { BinanceAggTradeResponse } from '../src/producers'
import { Exchange, NormalizedTradeData } from '../src/types'

export const mockBinanceAggTradeResponse: BinanceAggTradeResponse = {
    e: 'aggTrade',
    E: 1704043668175,
    s: 'BTCUSDT',
    a: 2807515140,
    p: '42526.19000000',
    q: '0.02762000',
    f: 3344470977,
    l: 3344470977,
    T: 1704043668174,
    m: false,
    M: true,
}

export const mockBinanceNormalizedTrade: NormalizedTradeData = {
    exchange: Exchange.BINANCE,
    price: Number(mockBinanceAggTradeResponse.p),
    quantity: Number(mockBinanceAggTradeResponse.q),
    size: Number(mockBinanceAggTradeResponse.p) * Number(mockBinanceAggTradeResponse.q),
    time: mockBinanceAggTradeResponse.T,
}
