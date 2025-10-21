"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useMarketData } from "@/hooks/use-market-data"

export function MarketChart() {
  const { selectedAsset, setSelectedAsset, timeframe, setTimeframe, chartData, assets } = useMarketData()

  const currentAsset = assets.find((a) => a.symbol === selectedAsset)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{selectedAsset}</CardTitle>
            {currentAsset && (
              <p className="mt-1 text-sm text-muted-foreground">
                ${currentAsset.price.toLocaleString()} {currentAsset.change24h >= 0 ? "+" : ""}
                {currentAsset.change24h.toFixed(2)}%
              </p>
            )}
          </div>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {assets.map((asset) => (
              <option key={asset.symbol} value={asset.symbol}>
                {asset.symbol}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Timeframe Tabs */}
        <Tabs value={timeframe} onValueChange={(value) => setTimeframe(value as any)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="1m">1M</TabsTrigger>
            <TabsTrigger value="5m">5M</TabsTrigger>
            <TabsTrigger value="15m">15M</TabsTrigger>
            <TabsTrigger value="1h">1H</TabsTrigger>
            <TabsTrigger value="4h">4H</TabsTrigger>
            <TabsTrigger value="1d">1D</TabsTrigger>
          </TabsList>

          <TabsContent value={timeframe} className="mt-4">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                />
                <Line type="monotone" dataKey="price" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
