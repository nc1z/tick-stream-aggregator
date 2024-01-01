import { normalizeBinanceTrade, normalizeBybitTrade } from '../src/producers/mapper'
import {
    mockBinanceAggTradeResponse,
    mockBinanceNormalizedTrade,
    mockBybitNormalizedTrade,
    mockBybitTradeResponse,
} from './mocks'

describe('mappers', () => {
    describe('normalizeBinanceTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBinanceTrade(mockBinanceAggTradeResponse)).toEqual(mockBinanceNormalizedTrade)
        })
    })

    describe('normalizeBybitTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBybitTrade(mockBybitTradeResponse)).toEqual(mockBybitNormalizedTrade)
        })
    })
})
