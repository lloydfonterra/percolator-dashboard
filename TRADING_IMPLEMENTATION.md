# Real Trading Functionality Implementation

This guide shows how to implement real order submission, portfolio tracking, and PnL calculations in your dashboard.

## 🎯 Architecture Overview

```
Dashboard UI
    ↓
usePercolatorTrading Hook
    ↓
Instruction Builders
    ↓
Solana Web3.js
    ↓
Percolator Programs (Router/Slab)
    ↓
Blockchain
```

---

## 1️⃣ Update usePercolatorTrading Hook

Replace mock data with real blockchain calls:

```typescript
// hooks/use-percolator-trading.ts
"use client"

import { useState, useCallback } from "react"
import { Connection, PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js"
import { useWallet } from "@solana/wallet-adapter-react"
import * as bs58 from "bs58"

const ROUTER_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_ROUTER_PROGRAM!)
const SLAB_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SLAB_PROGRAM!)
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || "https://api.devnet.solana.com"

export interface PercolatorOrder {
  id: string
  pair: string
  type: "long" | "short"
  orderType: "market" | "limit"
  size: number
  price: number
  leverage: number
  status: "pending" | "filled" | "cancelled"
  timestamp: Date
  txSignature?: string
}

export interface OrderFormData {
  pair: string
  orderType: "market" | "limit"
  positionType: "long" | "short"
  size: string
  price: string
  leverage: number
}

export function usePercolatorTrading() {
  const { publicKey, sendTransaction } = useWallet()
  const [orders, setOrders] = useState<PercolatorOrder[]>([])
  const [portfolio, setPortfolio] = useState({ collateral: 0, positions: [] })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize trader's vault account on first connection
  const initializeTrader = useCallback(async () => {
    if (!publicKey) return

    try {
      const connection = new Connection(RPC_ENDPOINT, "confirmed")
      
      // Create initialization instruction
      const instruction = new TransactionInstruction({
        programId: ROUTER_PROGRAM_ID,
        keys: [
          { pubkey: publicKey, isSigner: true, isWritable: true }, // Trader
          { pubkey: publicKey, isSigner: false, isWritable: true }, // Vault PDA
        ],
        data: Buffer.from([0]), // Initialize instruction code
      })

      const tx = new Transaction().add(instruction)
      const signature = await sendTransaction(tx, connection)
      await connection.confirmTransaction(signature, "confirmed")
      
      console.log("✅ Trader initialized:", signature)
      return signature
    } catch (err) {
      console.error("Initialization error:", err)
      setError(err instanceof Error ? err.message : "Initialization failed")
    }
  }, [publicKey, sendTransaction])

  // Submit a real order to the blockchain
  const submitOrder = useCallback(
    async (formData: OrderFormData) => {
      if (!publicKey || !sendTransaction) {
        setError("Wallet not connected")
        return false
      }

      setIsSubmitting(true)
      setError(null)

      try {
        // Validate form
        if (!formData.size || Number.parseFloat(formData.size) <= 0) {
          throw new Error("Invalid position size")
        }

        const connection = new Connection(RPC_ENDPOINT, "confirmed")
        const size = Math.floor(Number.parseFloat(formData.size) * 1e9) // Convert to lamports/smallest unit
        const price = Math.floor(Number.parseFloat(formData.price || "0") * 1e6) // Price with 6 decimals
        const leverage = Math.floor(formData.leverage * 1e3) // 3 decimals

        // Build commit_fill instruction for Slab program
        const instruction = new TransactionInstruction({
          programId: SLAB_PROGRAM_ID,
          keys: [
            { pubkey: publicKey, isSigner: true, isWritable: true },
            { pubkey: publicKey, isSigner: false, isWritable: true }, // Vault
          ],
          data: Buffer.concat([
            Buffer.from([1]), // commit_fill instruction
            Buffer.from(size.toString().padStart(16, '0')),
            Buffer.from(price.toString().padStart(16, '0')),
            Buffer.from(leverage.toString().padStart(8, '0')),
            Buffer.from([formData.positionType === "long" ? 1 : 0]),
            Buffer.from([formData.orderType === "market" ? 1 : 0]),
          ]),
        })

        const tx = new Transaction().add(instruction)
        const signature = await sendTransaction(tx, connection)
        
        // Wait for confirmation
        const confirmed = await connection.confirmTransaction(signature, "confirmed")

        if (confirmed.value.err) {
          throw new Error("Transaction failed on-chain")
        }

        // Add order to list
        const newOrder: PercolatorOrder = {
          id: signature,
          pair: formData.pair,
          type: formData.positionType,
          orderType: formData.orderType,
          size: Number.parseFloat(formData.size),
          price: Number.parseFloat(formData.price || "0"),
          leverage: formData.leverage,
          status: "pending",
          timestamp: new Date(),
          txSignature: signature,
        }

        setOrders((prev) => [newOrder, ...prev])
        return true
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to submit order"
        setError(errorMsg)
        console.error("Order error:", err)
        return false
      } finally {
        setIsSubmitting(false)
      }
    },
    [publicKey, sendTransaction]
  )

  // Fetch user's portfolio from blockchain
  const fetchPortfolio = useCallback(async () => {
    if (!publicKey) return

    try {
      const connection = new Connection(RPC_ENDPOINT, "confirmed")
      
      // Derive vault PDA
      const [vaultPda] = await PublicKey.findProgramAddress(
        [Buffer.from("vault"), publicKey.toBuffer()],
        ROUTER_PROGRAM_ID
      )

      // Get vault account data
      const vaultAccount = await connection.getAccountInfo(vaultPda)
      if (!vaultAccount) {
        setPortfolio({ collateral: 0, positions: [] })
        return
      }

      // Parse collateral amount (first 8 bytes after header)
      const collateral = Number(BigInt.fromBE(vaultAccount.data.slice(8, 16))) / 1e9

      // Fetch all user positions from Slab
      const positions = await connection.getProgramAccounts(SLAB_PROGRAM_ID, {
        filters: [
          { memcmp: { offset: 0, bytes: publicKey.toBase58() } },
        ],
      })

      setPortfolio({
        collateral,
        positions: positions.map((p) => ({
          address: p.pubkey.toBase58(),
          size: 0, // Parse from account data
          pnl: 0,  // Calculate based on current price
        })),
      })
    } catch (err) {
      console.error("Portfolio fetch error:", err)
    }
  }, [publicKey])

  // Cancel an order
  const cancelOrder = useCallback(
    (orderId: string) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      )
    },
    []
  )

  return {
    orders,
    portfolio,
    isSubmitting,
    error,
    submitOrder,
    cancelOrder,
    initializeTrader,
    fetchPortfolio,
  }
}
```

---

## 2️⃣ Create Instruction Builders

Separate instruction logic for cleaner code:

```typescript
// lib/percolator-instructions.ts
import { PublicKey, TransactionInstruction, SystemProgram } from "@solana/web3.js"

const ROUTER_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_ROUTER_PROGRAM!)
const SLAB_PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_SLAB_PROGRAM!)

export interface OrderParams {
  size: number      // in tokens
  price: number     // in quote decimals
  leverage: number  // 1x, 2x, etc
  isLong: boolean   // true = long, false = short
  isMarket: boolean // true = market, false = limit
}

// Build a commit_fill instruction for the Slab program
export function buildCommitFillInstruction(
  userKey: PublicKey,
  params: OrderParams
): TransactionInstruction {
  // Encode parameters
  const data = Buffer.concat([
    Buffer.from([1]), // commit_fill opcode
    encodeU64(params.size),
    encodeU64(params.price),
    encodeU32(Math.floor(params.leverage * 1000)),
    Buffer.from([params.isLong ? 1 : 0]),
    Buffer.from([params.isMarket ? 1 : 0]),
  ])

  return new TransactionInstruction({
    programId: SLAB_PROGRAM_ID,
    keys: [
      { pubkey: userKey, isSigner: true, isWritable: true },
      { pubkey: userKey, isSigner: false, isWritable: true }, // Vault
    ],
    data,
  })
}

// Build a deposit instruction for the Router
export function buildDepositInstruction(
  userKey: PublicKey,
  amount: number
): TransactionInstruction {
  const data = Buffer.concat([
    Buffer.from([0]), // deposit opcode
    encodeU64(amount),
  ])

  return new TransactionInstruction({
    programId: ROUTER_PROGRAM_ID,
    keys: [
      { pubkey: userKey, isSigner: true, isWritable: true },
      { pubkey: userKey, isSigner: false, isWritable: true }, // Vault PDA
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  })
}

// Helper encoding functions
function encodeU64(value: number): Buffer {
  const buf = Buffer.alloc(8)
  buf.writeBigUInt64LE(BigInt(value))
  return buf
}

function encodeU32(value: number): Buffer {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(value)
  return buf
}
```

---

## 3️⃣ Update Order Form Component

Connect the form to real trading:

```typescript
// components/order-form.tsx
import { usePercolatorTrading } from "@/hooks/use-percolator-trading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function OrderForm() {
  const { submitOrder, isSubmitting, error } = usePercolatorTrading()
  const [pair, setPair] = useState("SOL/USDC")
  const [size, setSize] = useState("")
  const [price, setPrice] = useState("")
  const [leverage, setLeverage] = useState(1)
  const [orderType, setOrderType] = useState<"market" | "limit">("market")
  const [positionType, setPositionType] = useState<"long" | "short">("long")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await submitOrder({
      pair,
      orderType,
      positionType,
      size,
      price,
      leverage,
    })

    if (success) {
      // Reset form
      setSize("")
      setPrice("")
      setLeverage(1)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-lg font-bold">Place Order</h2>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <label>Pair</label>
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <option>SOL/USDC</option>
          <option>BTC/USDC</option>
          <option>ETH/USDC</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Position Type</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={positionType === "long" ? "default" : "outline"}
              onClick={() => setPositionType("long")}
            >
              Long
            </Button>
            <Button
              type="button"
              variant={positionType === "short" ? "default" : "outline"}
              onClick={() => setPositionType("short")}
            >
              Short
            </Button>
          </div>
        </div>

        <div>
          <label>Order Type</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant={orderType === "market" ? "default" : "outline"}
              onClick={() => setOrderType("market")}
            >
              Market
            </Button>
            <Button
              type="button"
              variant={orderType === "limit" ? "default" : "outline"}
              onClick={() => setOrderType("limit")}
            >
              Limit
            </Button>
          </div>
        </div>
      </div>

      <div>
        <label>Size</label>
        <Input
          type="number"
          placeholder="0.00"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </div>

      {orderType === "limit" && (
        <div>
          <label>Price</label>
          <Input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      )}

      <div>
        <label>Leverage: {leverage}x</label>
        <input
          type="range"
          min="1"
          max="10"
          value={leverage}
          onChange={(e) => setLeverage(Number(e.target.value))}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !size}
        className="w-full"
      >
        {isSubmitting ? "Submitting..." : "Place Order"}
      </Button>
    </form>
  )
}
```

---

## 4️⃣ Real-Time Portfolio Updates

Fetch and display live data:

```typescript
// hooks/use-portfolio-updates.ts
import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { usePercolatorTrading } from "./use-percolator-trading"

export function usePortfolioUpdates() {
  const { publicKey } = useWallet()
  const { fetchPortfolio, portfolio } = usePercolatorTrading()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!publicKey) return

    // Fetch on mount
    fetchPortfolio()

    // Refetch every 5 seconds
    const interval = setInterval(fetchPortfolio, 5000)
    return () => clearInterval(interval)
  }, [publicKey, fetchPortfolio])

  return { portfolio, isLoading }
}
```

---

## 5️⃣ UI Branding & Customization

### Update Colors & Theme

Edit `app/globals.css`:

```css
:root {
  --primary: #1e88e5;      /* Your brand primary color */
  --secondary: #00bcd4;    /* Accent color */
  --background: #0f1419;   /* Dark background */
  --foreground: #ffffff;   /* Text color */
  --destructive: #ff5252;  /* Error/warning */
}
```

### Customize Dashboard Header

```typescript
// components/dashboard-header.tsx
export function DashboardHeader() {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary p-6">
      <h1 className="text-3xl font-bold text-white">
        Percolator DEX 🌀
      </h1>
      <p className="text-secondary/80">
        High-Performance Perpetual Futures on Solana
      </p>
    </header>
  )
}
```

### Add Custom Logo

1. Place logo in `/public/logo.png` (transparent PNG recommended)
2. Update `components/theme-provider.tsx`:

```typescript
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Logo" className="h-10" />
        <span className="font-bold text-xl">Percolator</span>
      </div>
      {children}
    </div>
  )
}
```

---

## 🧪 Testing Checklist

- [ ] Deploy programs to devnet
- [ ] Fund wallet with devnet SOL
- [ ] Connect Phantom wallet
- [ ] Initialize trader account
- [ ] Deposit collateral
- [ ] Place market order
- [ ] Place limit order
- [ ] Check order in Solana Explorer
- [ ] View portfolio PnL
- [ ] Cancel order
- [ ] Withdraw collateral

---

## 📚 Key Functions to Implement

| Function | Purpose |
|----------|---------|
| `initializeTrader()` | Create vault PDA for user |
| `depositCollateral()` | Transfer SOL/USDC to vault |
| `submitOrder()` | Send commit_fill to Slab |
| `cancelOrder()` | Revoke pending order |
| `fetchPortfolio()` | Get positions & PnL |
| `withdrawCollateral()` | Withdraw from vault |

---

## 🚀 Next: Advanced Features

Once basic trading works:
- ✅ Stop loss / take profit orders
- ✅ Multi-slab cross routing
- ✅ Real-time price feeds
- ✅ Advanced charting
- ✅ Portfolio analytics

---

**Happy coding! 🚀**
