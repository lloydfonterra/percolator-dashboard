"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePositionManagement } from "@/hooks/use-position-management"

export function PositionStats() {
  const { positionStats } = usePositionManagement()

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      default:
        return "text-accent"
    }
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Margin Used</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${positionStats.totalMarginUsed.toFixed(2)}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {positionStats.totalMarginPercent.toFixed(1)}% of balance
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Unrealized PnL</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${positionStats.totalUnrealizedPnL >= 0 ? "text-accent" : "text-destructive"}`}
          >
            {positionStats.totalUnrealizedPnL >= 0 ? "+" : ""}${positionStats.totalUnrealizedPnL.toFixed(2)}
          </div>
          <p className={`mt-1 text-xs ${positionStats.totalUnrealizedPnL >= 0 ? "text-accent" : "text-destructive"}`}>
            {positionStats.totalUnrealizedPnLPercent.toFixed(2)}%
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getRiskColor(positionStats.overallRiskLevel)}`}>
            {positionStats.overallRiskLevel.charAt(0).toUpperCase() + positionStats.overallRiskLevel.slice(1)}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {positionStats.positionsAtRisk} position{positionStats.positionsAtRisk !== 1 ? "s" : ""} at risk
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
