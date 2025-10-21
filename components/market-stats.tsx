"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMarketData } from "@/hooks/use-market-data"

export function MarketStats() {
  const { assets } = useMarketData()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {assets.map((asset) => (
        <Card key={asset.symbol}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">{asset.symbol}</CardTitle>
              <span className={`text-xs font-semibold ${asset.change24h >= 0 ? "text-accent" : "text-destructive"}`}>
                {asset.change24h >= 0 ? "+" : ""}
                {asset.change24h.toFixed(2)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{asset.name}</p>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Price</span>
              <span className="font-medium">${asset.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Volume</span>
              <span className="font-medium">${(asset.volume24h / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h High</span>
              <span className="font-medium">${asset.high24h.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">24h Low</span>
              <span className="font-medium">${asset.low24h.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
