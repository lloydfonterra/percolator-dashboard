"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { PositionWithRisk } from "@/hooks/use-position-management"
import { usePositionManagement } from "@/hooks/use-position-management"

interface PositionCardProps {
  position: PositionWithRisk
}

export function PositionCard({ position }: PositionCardProps) {
  const { closePosition, adjustLeverage, setStopLoss, setTakeProfit } = usePositionManagement()
  const [newLeverage, setNewLeverage] = useState(position.leverage)
  const [stopLossPrice, setStopLossPrice] = useState("")
  const [takeProfitPrice, setTakeProfitPrice] = useState("")

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "danger":
        return "destructive"
      case "warning":
        return "secondary"
      default:
        return "default"
    }
  }

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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-base">{position.pair}</CardTitle>
            <Badge variant={position.type === "long" ? "default" : "secondary"}>{position.type.toUpperCase()}</Badge>
            <Badge variant={getRiskBadgeVariant(position.liquidationRisk)}>
              {position.liquidationRisk.charAt(0).toUpperCase() + position.liquidationRisk.slice(1)}
            </Badge>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${position.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
              {position.pnl >= 0 ? "+" : ""}${position.pnl.toFixed(2)}
            </p>
            <p className={`text-xs ${position.pnl >= 0 ? "text-accent" : "text-destructive"}`}>
              {position.pnlPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Position Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Size</p>
            <p className="font-medium">{position.size}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Entry Price</p>
            <p className="font-medium">${position.entryPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Current Price</p>
            <p className="font-medium">${position.currentPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Leverage</p>
            <p className="font-medium">{position.leverage}x</p>
          </div>
        </div>

        {/* Liquidation Info */}
        <div className="rounded-lg border border-border bg-background p-3 text-xs">
          <div className="mb-2 flex justify-between">
            <span className="text-muted-foreground">Liquidation Price</span>
            <span className="font-medium">${position.liquidationPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Distance to Liquidation</span>
            <span className={`font-medium ${getRiskColor(position.liquidationRisk)}`}>
              {position.distancePercent.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Margin Info */}
        <div className="rounded-lg border border-border bg-background p-3 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Margin Used</span>
            <span className="font-medium">${position.marginUsed.toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" className="flex-1" onClick={() => closePosition(position.id)}>
            Close Position
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                Manage
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Position - {position.pair}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Adjust Leverage */}
                <div>
                  <Label htmlFor="leverage" className="text-xs">
                    Adjust Leverage: {newLeverage}x
                  </Label>
                  <input
                    id="leverage"
                    type="range"
                    min="1"
                    max="20"
                    value={newLeverage}
                    onChange={(e) => setNewLeverage(Number(e.target.value))}
                    className="mt-2 w-full"
                  />
                  <Button size="sm" className="mt-2 w-full" onClick={() => adjustLeverage(position.id, newLeverage)}>
                    Update Leverage
                  </Button>
                </div>

                {/* Stop Loss */}
                <div>
                  <Label htmlFor="sl" className="text-xs">
                    Stop Loss Price
                  </Label>
                  <Input
                    id="sl"
                    type="number"
                    placeholder={position.liquidationPrice.toFixed(2)}
                    value={stopLossPrice}
                    onChange={(e) => setStopLossPrice(e.target.value)}
                    className="mt-1"
                  />
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setStopLoss(position.id, Number(stopLossPrice))}
                  >
                    Set Stop Loss
                  </Button>
                </div>

                {/* Take Profit */}
                <div>
                  <Label htmlFor="tp" className="text-xs">
                    Take Profit Price
                  </Label>
                  <Input
                    id="tp"
                    type="number"
                    placeholder={position.currentPrice.toFixed(2)}
                    value={takeProfitPrice}
                    onChange={(e) => setTakeProfitPrice(e.target.value)}
                    className="mt-1"
                  />
                  <Button
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => setTakeProfit(position.id, Number(takeProfitPrice))}
                  >
                    Set Take Profit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}
