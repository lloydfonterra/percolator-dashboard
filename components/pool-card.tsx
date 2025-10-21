"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LiquidityPool } from "@/hooks/use-liquidity-pools"
import { useLiquidityPools } from "@/hooks/use-liquidity-pools"
import { Spinner } from "@/components/ui/spinner"

interface PoolCardProps {
  pool: LiquidityPool
}

export function PoolCard({ pool }: PoolCardProps) {
  const { addLiquidity, removeLiquidity, claimEarnings, isLoading } = useLiquidityPools()
  const [amount0, setAmount0] = useState("")
  const [amount1, setAmount1] = useState("")
  const [removePercentage, setRemovePercentage] = useState(50)

  const handleAddLiquidity = async () => {
    if (amount0 && amount1) {
      await addLiquidity(pool.id, Number(amount0), Number(amount1))
      setAmount0("")
      setAmount1("")
    }
  }

  const handleRemoveLiquidity = async () => {
    await removeLiquidity(pool.id, removePercentage)
  }

  const handleClaimEarnings = async () => {
    await claimEarnings(pool.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{pool.pair}</CardTitle>
          <div className="text-right">
            <p className="text-lg font-bold text-accent">{pool.apy.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">APY</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Pool Stats */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-muted-foreground">TVL</p>
            <p className="font-medium">${(pool.tvl / 1e6).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">24h Volume</p>
            <p className="font-medium">${(pool.volume24h / 1e6).toFixed(1)}M</p>
          </div>
          <div>
            <p className="text-muted-foreground">Fee</p>
            <p className="font-medium">{pool.fee}%</p>
          </div>
          <div>
            <p className="text-muted-foreground">Your Share</p>
            <p className="font-medium">{pool.yourShare.toFixed(4)}%</p>
          </div>
        </div>

        {/* Your Position */}
        {pool.yourLiquidity > 0 && (
          <div className="rounded-lg border border-border bg-background p-3 text-xs">
            <div className="mb-2 flex justify-between">
              <span className="text-muted-foreground">Your Liquidity</span>
              <span className="font-medium">${pool.yourLiquidity.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unclaimed Earnings</span>
              <span className="font-medium text-accent">${pool.yourEarnings.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex-1">
                Add Liquidity
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Liquidity to {pool.pair}</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount0" className="text-xs">
                    {pool.token0} Amount
                  </Label>
                  <Input
                    id="amount0"
                    type="number"
                    placeholder="0.00"
                    value={amount0}
                    onChange={(e) => setAmount0(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="amount1" className="text-xs">
                    {pool.token1} Amount
                  </Label>
                  <Input
                    id="amount1"
                    type="number"
                    placeholder="0.00"
                    value={amount1}
                    onChange={(e) => setAmount1(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <Button onClick={handleAddLiquidity} disabled={isLoading || !amount0 || !amount1} className="w-full">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner className="h-4 w-4" />
                      Adding...
                    </div>
                  ) : (
                    "Add Liquidity"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {pool.yourLiquidity > 0 && (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Remove
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Remove Liquidity from {pool.pair}</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="percentage" className="text-xs">
                        Percentage to Remove: {removePercentage}%
                      </Label>
                      <input
                        id="percentage"
                        type="range"
                        min="0"
                        max="100"
                        value={removePercentage}
                        onChange={(e) => setRemovePercentage(Number(e.target.value))}
                        className="mt-2 w-full"
                      />
                    </div>

                    <div className="rounded-lg border border-border bg-background p-3 text-xs">
                      <p className="text-muted-foreground">You will receive approximately:</p>
                      <p className="mt-1 font-medium">
                        {((pool.yourLiquidity * removePercentage) / 100).toFixed(2)} USDC
                      </p>
                    </div>

                    <Button
                      onClick={handleRemoveLiquidity}
                      disabled={isLoading}
                      variant="destructive"
                      className="w-full"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Spinner className="h-4 w-4" />
                          Removing...
                        </div>
                      ) : (
                        "Remove Liquidity"
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                size="sm"
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={handleClaimEarnings}
                disabled={isLoading || pool.yourEarnings === 0}
              >
                {isLoading ? "Claiming..." : "Claim"}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
