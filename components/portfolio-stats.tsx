"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"

export function PortfolioStats() {
  const { stats } = usePortfolio()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "danger":
        return "text-destructive"
      case "warning":
        return "text-yellow-500"
      default:
        return "text-accent"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.totalBalance.toFixed(2)}</div>
          <p className={`mt-1 text-xs ${stats.unrealizedPnL >= 0 ? "text-accent" : "text-destructive"}`}>
            {stats.unrealizedPnL >= 0 ? "+" : ""}${stats.unrealizedPnL.toFixed(2)} (
            {stats.unrealizedPnLPercent.toFixed(2)}%)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Open Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.openPositions}</div>
          <p className="mt-1 text-xs text-muted-foreground">Active trades</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">24h Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${(stats.totalVolume24h / 1000).toFixed(1)}K</div>
          <p className="mt-1 text-xs text-muted-foreground">Trading volume</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Liquidation Price</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${stats.liquidationPrice.toFixed(2)}</div>
          <p className={`mt-1 text-xs ${getRiskColor(stats.liquidationRisk)}`}>
            {stats.liquidationRisk.charAt(0).toUpperCase() + stats.liquidationRisk.slice(1)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
