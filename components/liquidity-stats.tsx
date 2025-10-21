"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLiquidityPools } from "@/hooks/use-liquidity-pools"

export function LiquidityStats() {
  const { totalLiquidityValue, totalEarnings } = useLiquidityPools()

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Liquidity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalLiquidityValue.toFixed(2)}</div>
          <p className="mt-1 text-xs text-muted-foreground">Across all pools</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">${totalEarnings.toFixed(2)}</div>
          <p className="mt-1 text-xs text-muted-foreground">Unclaimed rewards</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Active Pools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="mt-1 text-xs text-muted-foreground">Providing liquidity</p>
        </CardContent>
      </Card>
    </div>
  )
}
