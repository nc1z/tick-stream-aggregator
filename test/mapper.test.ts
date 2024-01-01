import { normalizeBinanceTrade } from '../src/producers/mapper'
import { mockBinanceAggTradeResponse, mockBinanceNormalizedTrade } from './mocks'

describe('mappers', () => {
    describe('normalizeBinanceTrade', () => {
        test('should return normalized trade data', () => {
            expect(normalizeBinanceTrade(mockBinanceAggTradeResponse)).toEqual(mockBinanceNormalizedTrade)
        })
    })
})
