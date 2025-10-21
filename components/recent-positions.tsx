"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Badge } from "@/components/ui/badge"

export function RecentPositions() {
  const { positions } = usePortfolio()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {positions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No open positions</p>
          ) : (
            positions.map((position) => (
              <div key={position.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{position.pair}</p>
                    <Badge variant={position.type === "long" ? "default" : "secondary"}>
                      {position.type.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {position.size} • {position.leverage}x leverage
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${position.currentPrice.toFixed(2)}</p>
                  <p className={`text-xs ${position.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
                    {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
