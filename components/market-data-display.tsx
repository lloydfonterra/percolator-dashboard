"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"

interface TokenPrice {
  usd: number
  usd_24h_change?: number
}

interface PriceData {
  [key: string]: TokenPrice
}

export function MarketDataDisplay() {
  const [prices, setPrices] = useState<PriceData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        )
        const data = await response.json()
        setPrices(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch market data")
        console.error("Market data fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    // Refresh every 30 seconds
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [])

  const tokens = [
    { id: "solana", name: "Solana", symbol: "SOL", color: "from-purple-500 to-purple-600" },
    { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "from-orange-500 to-orange-600" },
    { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "from-blue-500 to-blue-600" },
  ]

  if (loading && !Object.keys(prices).length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <Card key={token.id} className="bg-gradient-to-br from-slate-900 to-slate-800">
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tokens.map((token) => {
        const price = prices[token.id]
        const change = price?.usd_24h_change || 0
        const isPositive = change >= 0

        return (
          <Card
            key={token.id}
            className={`bg-gradient-to-br ${token.color} hover:shadow-lg transition-all`}
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
                <div>
                  <p className="text-3xl font-bold text-white">${price.usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className={`text-sm mt-2 font-semibold ${isPositive ? "text-green-300" : "text-red-300"}`}>
                    {isPositive ? "+" : ""}{change.toFixed(2)}% 24h
                  </p>
                </div>
              ) : (
                <p className="text-white/60">Loading...</p>
              )}
            </CardContent>
          </Card>
        )
      })}

      {error && (
        <div className="col-span-full p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
