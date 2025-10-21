"use client"

import { PortfolioStats } from "./portfolio-stats"
import { PortfolioChart } from "./portfolio-chart"
import { RecentPositions } from "./recent-positions"

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio and trading activity</p>
      </div>

      <PortfolioStats />
      <PortfolioChart />
      <RecentPositions />
    </div>
  )
}
