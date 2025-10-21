"use client"

import { usePythPrices } from "@/hooks/use-pyth-prices"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export function PythPriceDisplay() {
  const prices = usePythPrices()

  const tokens = [
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      color: "from-blue-500 to-blue-600",
    },
  ]

  if (prices.loading && !prices.solana && !prices.bitcoin && !prices.ethereum) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token) => (
          <Card
            key={token.id}
            className={`bg-gradient-to-br ${token.color} animate-pulse`}
          >
            <CardHeader className="pb-2">
              <div className="h-4 bg-white/20 rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-white/20 rounded w-32 mb-2"></div>
              <div className="h-4 bg-white/20 rounded w-24"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">Pyth Oracle - On-Chain Prices</h2>
        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
          Real-time (±50ms)
        </Badge>
      </div>

      {prices.error && (
        <div className="p-4 bg-amber-500/10 border border-amber-500 rounded-lg text-amber-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Pyth Connection Issue</p>
            <p className="text-xs mt-1">{prices.error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tokens.map((token) => {
          const price = prices[token.id as keyof typeof prices]

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
                </div>
              </CardHeader>
              <CardContent>
                {price && price.price ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-3xl font-bold text-white">
                        ${price.price.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      {price.confidence && (
                        <p className="text-xs text-white/60 mt-1">
                          ±${price.confidence.toFixed(2)} confidence
                        </p>
                      )}
                    </div>

                    <div className="text-xs text-white/60 space-y-1 border-t border-white/20 pt-2">
                      <div className="flex justify-between">
                        <span>Source:</span>
                        <span className="text-white/90 font-semibold">Pyth Oracle</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Latency:</span>
                        <span className="text-white/90">±50ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Updated:</span>
                        <span className="text-white/90 text-xs">
                          {price.timestamp
                            ? new Date(price.timestamp).toLocaleTimeString()
                            : "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : prices.loading ? (
                  <div className="animate-pulse space-y-2">
                    <div className="h-8 bg-white/20 rounded w-32"></div>
                    <div className="h-4 bg-white/20 rounded w-24"></div>
                  </div>
                ) : (
                  <p className="text-white/60 text-sm">No data available</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {prices.lastUpdate && (
        <p className="text-xs text-slate-500 text-center">
          Last updated: {prices.lastUpdate.toLocaleTimeString()} • Refreshing every 3 seconds
        </p>
      )}

      <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-xs text-slate-300 space-y-2">
        <p className="font-semibold text-slate-200">About Pyth Oracle</p>
        <ul className="list-disc list-inside space-y-1 text-slate-400">
          <li>On-chain price feeds from Pyth Network</li>
          <li>Real-time updates with ±50ms latency</li>
          <li>Used by major Solana DEXs (Magic Eden, Orca, Drift)</li>
          <li>Includes confidence intervals for volatility assessment</li>
          <li>Perfect for perpetual contracts and liquidation calculations</li>
        </ul>
      </div>
    </div>
  )
}
