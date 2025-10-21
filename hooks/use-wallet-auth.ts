"use client"

import { useCallback, useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { Connection } from "@solana/web3.js"

interface WalletAuthState {
  isConnected: boolean
  publicKey: string | null
  balance: number | null
  isLoading: boolean
  error: string | null
}

export function useWalletAuth() {
  const { connected, publicKey, disconnect, wallet } = useWallet()
  const [state, setState] = useState<WalletAuthState>({
    isConnected: false,
    publicKey: null,
    balance: null,
    isLoading: false,
    error: null,
  })
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isConnected: connected,
      publicKey: publicKey?.toString() || null,
    }))
  }, [connected, publicKey])

  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        setState((prev) => ({ ...prev, balance: null }))
        return
      }

      try {
        const connection = new Connection("https://api.devnet.solana.com")
        const balance = await connection.getBalance(publicKey)
        setState((prev) => ({
          ...prev,
          balance: balance / 1e9, // Convert lamports to SOL
        }))
      } catch (error) {
        console.error("Failed to fetch balance:", error)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 10000) // Refresh every 10 seconds

    return () => clearInterval(interval)
  }, [connected, publicKey])

  const handleDisconnect = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))
      await disconnect()
      setState((prev) => ({
        ...prev,
        isConnected: false,
        publicKey: null,
        balance: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to disconnect wallet",
      }))
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }))
    }
  }, [disconnect])

  return {
    ...state,
    disconnect: handleDisconnect,
    walletName: wallet?.adapter.name || null,
    isHydrated,
  }
}
