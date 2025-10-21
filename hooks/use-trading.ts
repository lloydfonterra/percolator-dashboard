"use client"

import { useState, useCallback } from "react"
import { useWalletAuth } from "./use-wallet-auth"

export interface Order {
  id: string
  pair: string
  type: "long" | "short"
  orderType: "market" | "limit"
  size: number
  price: number
  leverage: number
  status: "pending" | "filled" | "cancelled"
  timestamp: Date
}

export interface OrderFormData {
  pair: string
  orderType: "market" | "limit"
  positionType: "long" | "short"
  size: string
  price: string
  leverage: number
  takeProfit?: string
  stopLoss?: string
}

export function useTrading() {
  const { isConnected } = useWalletAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitOrder = useCallback(
    async (formData: OrderFormData) => {
      if (!isConnected) {
        setError("Wallet not connected")
        return false
      }

      setIsSubmitting(true)
      setError(null)

      try {
        // Validate form data
        if (!formData.size || Number.parseFloat(formData.size) <= 0) {
          throw new Error("Invalid position size")
        }

        if (formData.orderType === "limit" && (!formData.price || Number.parseFloat(formData.price) <= 0)) {
          throw new Error("Invalid limit price")
        }

        // Simulate order submission
        const newOrder: Order = {
          id: `order_${Date.now()}`,
          pair: formData.pair,
          type: formData.positionType,
          orderType: formData.orderType,
          size: Number.parseFloat(formData.size),
          price: Number.parseFloat(formData.price || "0"),
          leverage: formData.leverage,
          status: "pending",
          timestamp: new Date(),
        }

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setOrders((prev) => [newOrder, ...prev])
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit order")
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [isConnected],
  )

  const cancelOrder = useCallback((orderId: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)))
  }, [])

  return {
    orders,
    isSubmitting,
    error,
    submitOrder,
    cancelOrder,
  }
}
