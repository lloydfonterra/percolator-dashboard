"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TokenPrice {
  usd: number
  usd_24h_change?: number
  usd_high_24h?: number
  usd_low_24h?: number
  source?: string
}

interface PriceData {
  [key: string]: TokenPrice
}

export function MarketDataDisplay() {
  const [prices, setPrices] = useState<PriceData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setError(null)
        
        // Try Binance API first (most accurate real-time data)
        try {
          const response = await fetch(
            "https://api.binance.com/api/v3/ticker/24hr?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22SOLUSDT%22%5D",
            { signal: AbortSignal.timeout(5000) }
          )
          
          if (response.ok) {
            const data = await response.json()
            const binanceData: PriceData = {}
            
            data.forEach((ticker: any) => {
              const symbol = ticker.symbol
              let key = ""
              
              if (symbol === "BTCUSDT") key = "bitcoin"
              else if (symbol === "ETHUSDT") key = "ethereum"
              else if (symbol === "SOLUSDT") key = "solana"
              
              if (key) {
                binanceData[key] = {
                  usd: parseFloat(ticker.lastPrice),
                  usd_24h_change: parseFloat(ticker.priceChangePercent),
                  usd_high_24h: parseFloat(ticker.highPrice),
                  usd_low_24h: parseFloat(ticker.lowPrice),
                  source: "Binance"
                }
              }
            })
            
            if (Object.keys(binanceData).length > 0) {
              setPrices(binanceData)
              setLastUpdate(new Date())
              setRetryCount(0)
              setLoading(false)
              return
            }
          }
        } catch (binanceErr) {
          console.warn("Binance API failed, falling back to CoinGecko:", binanceErr)
        }
        
        // Fallback to CoinGecko if Binance fails
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true&include_24hr_high_low=true",
          { signal: AbortSignal.timeout(5000) }
        )

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        const coingeckoData: PriceData = {}
        
        Object.keys(data).forEach(key => {
          coingeckoData[key] = {
            ...data[key],
            source: "CoinGecko"
          }
        })
        
        setPrices(coingeckoData)
        setLastUpdate(new Date())
        setRetryCount(0)
        setLoading(false)
      } catch (err) {
        console.error("Market data fetch error:", err)
        setError("Failed to fetch market data. Retrying...")
        setRetryCount((prev) => prev + 1)

        // Retry with exponential backoff (max 3 retries)
        if (retryCount < 3) {
          setTimeout(fetchPrices, 2000 * (retryCount + 1))
        } else {
          setError("Unable to fetch market data")
        }
      }
    }

    fetchPrices()
    // Refresh every 5 seconds for real-time updates (faster than before)
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [retryCount])

  const tokens = [
    { id: "solana", name: "Solana", symbol: "SOL", color: "from-purple-500 to-purple-600" },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "from-orange-500 to-orange-600" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "from-blue-500 to-blue-600" },
  ]

  if (loading && !Object.keys(prices).length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <Card key={token.id} className="bg-gradient-to-br from-slate-900 to-slate-800 animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-slate-700 rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-700 rounded w-32 mb-2"></div>
              <div className="h-4 bg-slate-700 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token) => {
          const price = prices[token.id]
          const change = price?.usd_24h_change || 0
          const high24h = price?.usd_high_24h || 0
          const low24h = price?.usd_low_24h || 0
          const isPositive = change >= 0

          return (
            <Card
              key={token.id}
              className={`bg-gradient-to-br ${token.color} hover:shadow-lg transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{token.symbol}</CardTitle>
                    <p className="text-sm text-white/80">{token.name}</p>
                  </div>
                  <Badge variant={isPositive ? "default" : "destructive"} className="ml-2">
                    {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(change).toFixed(2)}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {price ? (
                  <div className="space-y-3">
                    <p className="text-3xl font-bold text-white">
                      ${price.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={`text-sm font-semibold ${isPositive ? "text-green-300" : "text-red-300"}`}>
                      {isPositive ? "+" : ""}{change.toFixed(2)}% 24h
                    </p>
                    {high24h && low24h && (
                      <div className="text-xs text-white/60 space-y-1 border-t border-white/20 pt-2">
                        <div className="flex justify-between">
                          <span>24h High:</span>
                          <span className="text-white/90">
                            ${high24h.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>24h Low:</span>
                          <span className="text-white/90">
                            ${low24h.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-white/10">
                          <span className="text-white/50">Source:</span>
                          <span className="text-white/70 text-xs">{price.source}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">Loading...</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      {lastUpdate && !error && (
        <p className="text-xs text-slate-500 text-center">
          Last updated: {lastUpdate.toLocaleTimeString()} • Auto-refresh every 5 seconds
        </p>
      )}
    </div>
  )
}
