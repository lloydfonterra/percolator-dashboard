"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTrading, type OrderFormData } from "@/hooks/use-trading"
import { Spinner } from "@/components/ui/spinner"

const TRADING_PAIRS = ["SOL/USDC", "BTC/USDC", "ETH/USDC", "ORCA/USDC"]
const CURRENT_PRICES: Record<string, number> = {
  "SOL/USDC": 148.5,
  "BTC/USDC": 43200,
  "ETH/USDC": 2420,
  "ORCA/USDC": 0.85,
}

export function OrderForm() {
  const { submitOrder, isSubmitting, error } = useTrading()
  const [formData, setFormData] = useState<OrderFormData>({
    pair: "SOL/USDC",
    orderType: "market",
    positionType: "long",
    size: "",
    price: "",
    leverage: 5,
    takeProfit: "",
    stopLoss: "",
  })

  const currentPrice = CURRENT_PRICES[formData.pair]
  const collateral = formData.size ? (Number.parseFloat(formData.size) * currentPrice) / formData.leverage : 0
  const liquidationPrice =
    formData.positionType === "long"
      ? currentPrice * (1 - 1 / formData.leverage)
      : currentPrice * (1 + 1 / formData.leverage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await submitOrder(formData)
    if (success) {
      setFormData({
        ...formData,
        size: "",
        price: "",
        takeProfit: "",
        stopLoss: "",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pair Selection */}
          <div>
            <Label htmlFor="pair" className="text-xs">
              Trading Pair
            </Label>
            <select
              id="pair"
              value={formData.pair}
              onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            >
              {TRADING_PAIRS.map((pair) => (
                <option key={pair} value={pair}>
                  {pair}
                </option>
              ))}
            </select>
          </div>

          {/* Order Type Tabs */}
          <Tabs
            value={formData.orderType}
            onValueChange={(value) => setFormData({ ...formData, orderType: value as any })}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="limit">Limit</TabsTrigger>
            </TabsList>

            <TabsContent value="market" className="space-y-3">
              <div className="rounded-lg border border-border bg-background p-2 text-xs">
                <p className="text-muted-foreground">Current Price</p>
                <p className="text-lg font-semibold">${currentPrice.toFixed(2)}</p>
              </div>
            </TabsContent>

            <TabsContent value="limit" className="space-y-3">
              <div>
                <Label htmlFor="limit-price" className="text-xs">
                  Limit Price
                </Label>
                <Input
                  id="limit-price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1"
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Position Type */}
          <div className="flex gap-2">
            {["long", "short"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFormData({ ...formData, positionType: type as "long" | "short" })}
                className={`flex-1 rounded-lg py-2 font-medium transition-colors ${
                  formData.positionType === type
                    ? type === "long"
                      ? "bg-accent text-accent-foreground"
                      : "bg-destructive text-destructive-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Size Input */}
          <div>
            <Label htmlFor="size" className="text-xs">
              Position Size ({formData.pair.split("/")[0]})
            </Label>
            <Input
              id="size"
              type="number"
              placeholder="0.00"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Leverage */}
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="leverage" className="text-xs">
                Leverage
              </Label>
              <span className="text-sm font-semibold">{formData.leverage}x</span>
            </div>
            <input
              id="leverage"
              type="range"
              min="1"
              max="20"
              value={formData.leverage}
              onChange={(e) => setFormData({ ...formData, leverage: Number(e.target.value) })}
              className="mt-2 w-full"
            />
          </div>

          {/* Take Profit & Stop Loss */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="tp" className="text-xs">
                Take Profit
              </Label>
              <Input
                id="tp"
                type="number"
                placeholder="0.00"
                value={formData.takeProfit}
                onChange={(e) => setFormData({ ...formData, takeProfit: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sl" className="text-xs">
                Stop Loss
              </Label>
              <Input
                id="sl"
                type="number"
                placeholder="0.00"
                value={formData.stopLoss}
                onChange={(e) => setFormData({ ...formData, stopLoss: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 rounded-lg border border-border bg-background p-3 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Entry Price:</span>
              <span>${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Liquidation Price:</span>
              <span>${liquidationPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Collateral Required:</span>
              <span>${collateral.toFixed(2)}</span>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="rounded-lg bg-destructive/10 p-2 text-xs text-destructive">{error}</div>}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !formData.size}
            className={`w-full ${
              formData.positionType === "long"
                ? "bg-accent hover:bg-accent/90"
                : "bg-destructive hover:bg-destructive/90"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner className="h-4 w-4" />
                Submitting...
              </div>
            ) : (
              `${formData.positionType === "long" ? "Open Long" : "Open Short"}`
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
