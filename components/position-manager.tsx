"use client"

import { PositionStats } from "./position-stats"
import { PositionCard } from "./position-card"
import { usePositionManagement } from "@/hooks/use-position-management"

export function PositionManager() {
  const { positionsWithRisk } = usePositionManagement()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Positions</h1>
        <p className="text-muted-foreground">Manage your open positions and track liquidation risk</p>
      </div>

      <PositionStats />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Open Positions</h2>
        {positionsWithRisk.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-6 text-center">
            <p className="text-muted-foreground">No open positions</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {positionsWithRisk.map((position) => (
              <PositionCard key={position.id} position={position} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
