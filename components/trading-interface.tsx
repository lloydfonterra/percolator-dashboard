"use client"

import { useState } from "react"
import { PriceChart } from "./price-chart"
import { OrderForm } from "./order-form"

export function TradingInterface() {
  const [selectedPair, setSelectedPair] = useState("SOL/USDC")

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Trading</h1>
        <p className="text-muted-foreground">Place orders and manage your positions</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PriceChart pair={selectedPair} />
        </div>

        <div>
          <OrderForm />
        </div>
      </div>
    </div>
  )
}
