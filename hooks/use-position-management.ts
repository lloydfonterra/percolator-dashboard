"use client"

import { useState, useCallback, useEffect } from "react"
import { usePortfolio, type Position } from "./use-portfolio"

export interface PositionWithRisk extends Position {
  marginUsed: number
  marginPercent: number
  liquidationRisk: "safe" | "warning" | "danger"
  distanceToLiquidation: number
  distancePercent: number
}

export interface PositionStats {
  totalMarginUsed: number
  totalMarginPercent: number
  totalUnrealizedPnL: number
  totalUnrealizedPnLPercent: number
  overallRiskLevel: "low" | "medium" | "high"
  positionsAtRisk: number
}

export function usePositionManagement() {
  const { positions, stats } = usePortfolio()
  const [positionsWithRisk, setPositionsWithRisk] = useState<PositionWithRisk[]>([])
  const [positionStats, setPositionStats] = useState<PositionStats>({
    totalMarginUsed: 0,
    totalMarginPercent: 0,
    totalUnrealizedPnL: 0,
    totalUnrealizedPnLPercent: 0,
    overallRiskLevel: "low",
    positionsAtRisk: 0,
  })

  useEffect(() => {
    const enrichedPositions = positions.map((pos) => {
      const marginUsed = (pos.size * pos.entryPrice) / pos.leverage
      const marginPercent = (marginUsed / stats.totalBalance) * 100

      const distanceToLiquidation = Math.abs(pos.currentPrice - pos.liquidationPrice)
      const distancePercent = (distanceToLiquidation / pos.currentPrice) * 100

      let liquidationRisk: "safe" | "warning" | "danger" = "safe"
      if (distancePercent < 5) liquidationRisk = "danger"
      else if (distancePercent < 10) liquidationRisk = "warning"

      return {
        ...pos,
        marginUsed,
        marginPercent,
        liquidationRisk,
        distanceToLiquidation,
        distancePercent,
      }
    })

    setPositionsWithRisk(enrichedPositions)

    const totalMarginUsed = enrichedPositions.reduce((sum, pos) => sum + pos.marginUsed, 0)
    const totalMarginPercent = (totalMarginUsed / stats.totalBalance) * 100
    const positionsAtRisk = enrichedPositions.filter((pos) => pos.liquidationRisk !== "safe").length

    let overallRiskLevel: "low" | "medium" | "high" = "low"
    if (positionsAtRisk > 0) overallRiskLevel = "medium"
    if (totalMarginPercent > 80 || positionsAtRisk > 1) overallRiskLevel = "high"

    setPositionStats({
      totalMarginUsed,
      totalMarginPercent,
      totalUnrealizedPnL: stats.unrealizedPnL,
      totalUnrealizedPnLPercent: stats.unrealizedPnLPercent,
      overallRiskLevel,
      positionsAtRisk,
    })
  }, [positions, stats])

  const closePosition = useCallback((positionId: string) => {
    // Simulate closing position
    console.log("Closing position:", positionId)
  }, [])

  const adjustLeverage = useCallback((positionId: string, newLeverage: number) => {
    // Simulate adjusting leverage
    console.log("Adjusting leverage for position:", positionId, "to", newLeverage)
  }, [])

  const setStopLoss = useCallback((positionId: string, stopLossPrice: number) => {
    // Simulate setting stop loss
    console.log("Setting stop loss for position:", positionId, "at", stopLossPrice)
  }, [])

  const setTakeProfit = useCallback((positionId: string, takeProfitPrice: number) => {
    // Simulate setting take profit
    console.log("Setting take profit for position:", positionId, "at", takeProfitPrice)
  }, [])

  return {
    positionsWithRisk,
    positionStats,
    closePosition,
    adjustLeverage,
    setStopLoss,
    setTakeProfit,
  }
}
