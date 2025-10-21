"use client"

import { LiquidityStats } from "./liquidity-stats"
import { PoolCard } from "./pool-card"
import { useLiquidityPools } from "@/hooks/use-liquidity-pools"

export function LiquidityPools() {
  const { pools, isLoading } = useLiquidityPools()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Liquidity Pools</h1>
        <p className="text-muted-foreground">Provide liquidity and earn trading fees</p>
      </div>

      <LiquidityStats />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Available Pools</h2>
        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading pools...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pools.map((pool) => (
              <PoolCard key={pool.id} pool={pool} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
