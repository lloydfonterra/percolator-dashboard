"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMarketData } from "@/hooks/use-market-data"

export function MarketMovers() {
  const { topGainers, topLosers } = useMarketData()

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {/* Top Gainers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Gainers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topGainers.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between rounded-lg border border-border p-2">
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  <p className="text-xs text-muted-foreground">${asset.price.toLocaleString()}</p>
                </div>
                <p className="text-sm font-semibold text-accent">+{asset.change24h.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Losers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Losers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topLosers.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between rounded-lg border border-border p-2">
                <div>
                  <p className="font-medium">{asset.symbol}</p>
                  <p className="text-xs text-muted-foreground">${asset.price.toLocaleString()}</p>
                </div>
                <p className="text-sm font-semibold text-destructive">{asset.change24h.toFixed(2)}%</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
