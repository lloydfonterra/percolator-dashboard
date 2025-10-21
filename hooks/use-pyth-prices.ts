"use client"

import { useEffect, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { PythConnection, getPythProgramPublicKey, PriceData } from "@pythnetwork/client"
import { PublicKey } from "@solana/web3.js"

interface PythPrice {
  symbol: string
  price: number
  confidence: number
  timestamp: number
  source: "Pyth"
}

interface PythPriceState {
  solana: PythPrice | null
  bitcoin: PythPrice | null
  ethereum: PythPrice | null
  loading: boolean
  error: string | null
  lastUpdate: Date | null
}

// Pyth price feed IDs on devnet
const PYTH_PRICE_FEEDS = {
  solana: "7UVimffxpirB8qu3Uc7kLU17HFF64Z0j4KwY3JyWXQs",
  bitcoin: "8GWTTbNiJmkiZ6THm3Z24ZyQWasFUWVzU7aeRApW8qhb",
  ethereum: "1sLe93sskSMc889ixG2PVz3JgvkYvnT99kTqSRoVjB0",
}

// Mainnet price feed IDs (when deploying to production)
const PYTH_PRICE_FEEDS_MAINNET = {
  solana: "J83w4HKfqxwcq3BEMMkPFSppX3gqekLn5LvRKwgqp2b",
  bitcoin: "GVXRSv1FM20vHoAfBL2GcJODprzgonWytvQYTcstqXgp",
  ethereum: "JBu1AL4obBx86eznNY62oXd1HcJE4b0rc2PceL47Xns",
}

export function usePythPrices() {
  const { connection } = useConnection()
  const [prices, setPrices] = useState<PythPriceState>({
    solana: null,
    bitcoin: null,
    ethereum: null,
    loading: true,
    error: null,
    lastUpdate: null,
  })

  useEffect(() => {
    if (!connection) {
      setPrices((prev) => ({
        ...prev,
        error: "No Solana connection available",
        loading: false,
      }))
      return
    }

    const fetchPythPrices = async () => {
      try {
        setPrices((prev) => ({ ...prev, error: null }))

        const pythConnection = new PythConnection(
          connection,
          getPythProgramPublicKey("devnet")
          // For mainnet, use: getPythProgramPublicKey("mainnet-beta")
        )

        // Get price data from Pyth accounts
        const pythData = await pythConnection.getAssetPricesFromAccounts([
          new PublicKey(PYTH_PRICE_FEEDS.solana),
          new PublicKey(PYTH_PRICE_FEEDS.bitcoin),
          new PublicKey(PYTH_PRICE_FEEDS.ethereum),
        ])

        if (pythData && pythData.length > 0) {
          const priceMap: Record<string, PythPrice> = {}

          pythData.forEach((priceData: any, index: number) => {
            if (!priceData) return

            const keys = Object.keys(PYTH_PRICE_FEEDS) as Array<
              keyof typeof PYTH_PRICE_FEEDS
            >
            const symbol = keys[index]

            // Extract price and confidence
            const price = priceData.getPriceAsNumberUnchecked?.()
            const confidence = priceData.confidenceInterval

            if (price !== undefined) {
              priceMap[symbol] = {
                symbol: symbol.toUpperCase(),
                price: typeof price === "number" ? price : parseFloat(price),
                confidence: confidence || 0,
                timestamp: Date.now(),
                source: "Pyth",
              }
            }
          })

          setPrices((prev) => ({
            ...prev,
            solana: priceMap.solana || prev.solana,
            bitcoin: priceMap.bitcoin || prev.bitcoin,
            ethereum: priceMap.ethereum || prev.ethereum,
            loading: false,
            lastUpdate: new Date(),
          }))
        }
      } catch (err) {
        console.warn("Error fetching Pyth prices:", err)
        setPrices((prev) => ({
          ...prev,
          error: `Pyth fetch failed: ${err instanceof Error ? err.message : "Unknown error"}`,
          loading: false,
        }))
      }
    }

    // Fetch immediately
    fetchPythPrices()

    // Refresh every 3 seconds for real-time updates
    const interval = setInterval(fetchPythPrices, 3000)

    return () => clearInterval(interval)
  }, [connection])

  return prices
}

export function usePythPrice(symbol: "solana" | "bitcoin" | "ethereum") {
  const prices = usePythPrices()

  return {
    price: prices[symbol]?.price || null,
    confidence: prices[symbol]?.confidence || null,
    timestamp: prices[symbol]?.timestamp || null,
    loading: prices.loading,
    error: prices.error,
    lastUpdate: prices.lastUpdate,
    source: "Pyth Oracle",
  }
}
