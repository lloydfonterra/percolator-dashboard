# 🔌 API Integration Guide for Percolator DEX

**Goal**: Add real-time market data and charts to your dashboard  
**Time**: ~30 minutes to set up all APIs  
**Cost**: FREE (all options have free tiers)

---

## 📋 Quick Summary

You need **3 main APIs**:

1. **CoinGecko** - Real-time token prices (FREE)
2. **TradingView** - Beautiful charts (FREE)
3. **Solana RPC** - On-chain data (Already have!)

---

## 🚀 Step 1: CoinGecko API (EASIEST - 2 minutes)

### **What it does:**
- Free real-time cryptocurrency prices
- No authentication needed
- Perfect for SOL, BTC, ETH, etc.

### **How to use:**

**Step 1.1: No signup needed!**
- Just use the free API directly
- URL: `https://api.coingecko.com/api/v3/`

**Step 1.2: Test it in your browser**

Open this URL in your browser:
```
https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true
```

You should see:
```json
{
  "solana": {
    "usd": 142.50,
    "usd_24h_change": 2.5
  },
  "bitcoin": {
    "usd": 43250.00,
    "usd_24h_change": 1.2
  }
}
```

**Step 1.3: Add to your dashboard**

In `hooks/use-market-data.ts`:

```typescript
export function useMarketData() {
  const [prices, setPrices] = useState({})

  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true')
      .then(r => r.json())
      .then(data => setPrices(data))
  }, [])

  return prices
}
```

**That's it for CoinGecko!** ✅

---

## 📊 Step 2: TradingView Charting Library (5 minutes)

### **What it does:**
- Embed professional trading charts
- Real-time candlesticks, indicators
- You provide the data, it renders beautifully

### **How to get it:**

**Step 2.1: Get the free widget**

Visit: https://www.tradingview.com/widget/

Click "Create widget" and copy the embed code

**Step 2.2: Install via NPM** (RECOMMENDED)

In your dashboard directory:
```bash
npm install lightweight-charts
```

Or if using the full Charting Library:
```bash
npm install @builtwithdart/tradingview-charting-library
```

**Step 2.3: Add to your component**

Create `components/market-chart-advanced.tsx`:

```typescript
import { useEffect, useRef } from 'react'
import { createChart } from 'lightweight-charts'

export function MarketChartAdvanced() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      width: 800,
      height: 400,
      timeScale: { timeVisible: true, secondsVisible: false },
    })

    const lineSeries = chart.addLineSeries({ color: '#2962FF' })

    // Add data from CoinGecko or your Solana programs
    lineSeries.setData([
      { time: '2025-01-01', value: 100 },
      { time: '2025-01-02', value: 105 },
      { time: '2025-01-03', value: 110 },
      // ... more data
    ])

    chart.timeScale().fitContent()
    return () => chart.remove()
  }, [])

  return <div ref={containerRef} />
}
```

**That's it for TradingView!** ✅

---

## ⛓️ Step 3: Solana RPC (You Already Have This!)

### **What it does:**
- Get on-chain data directly from Solana
- Token balances, transactions, program state

### **You already have:**
- RPC Endpoint: `https://api.devnet.solana.com`
- In your `.env.local`:
```
NEXT_PUBLIC_RPC_ENDPOINT=https://api.devnet.solana.com
```

### **How to use:**

**Step 3.1: Fetch token prices from Pyth Oracle**

```typescript
import { Connection, PublicKey } from '@solana/web3.js'

export async function getTokenPrice(tokenMint: string) {
  const connection = new Connection('https://api.devnet.solana.com')
  
  // Get account data
  const accountInfo = await connection.getAccountInfo(
    new PublicKey(tokenMint)
  )
  
  // Parse price data...
  return accountInfo
}
```

**Step 3.2: Alternative - Use Helius API** (Better for Solana data)

Visit: https://www.helius.dev/

1. Click "Start for Free"
2. Create account (1 minute)
3. Get API key
4. Use in your code:

```typescript
const heliusUrl = `https://mainnet-beta.helius-rpc.com/?api-key=YOUR_API_KEY`
const connection = new Connection(heliusUrl)
```

---

## 🔗 Step 4: Moralis Solana API (Optional, Better Alternative)

### **What it does:**
- Comprehensive Solana blockchain data
- Token info, wallet data, transaction history

### **How to get it:**

**Step 4.1: Sign up**

Visit: https://moralis.io/

1. Click "Start for Free"
2. Sign up with email
3. Verify email
4. Get API key

**Step 4.2: Create API Key**

1. Go to Dashboard
2. Click "Create API Key"
3. Copy your API key

**Step 4.3: Use in your dashboard**

```typescript
const response = await fetch('https://solana-gateway.moralis.io/account/mainnet/SOL_ADDRESS', {
  headers: {
    'X-API-Key': 'YOUR_MORALIS_API_KEY'
  }
})

const walletData = await response.json()
console.log(walletData) // Balance, tokens, etc.
```

---

## 🎯 Step 5: Alchemy Solana API (Premium Alternative)

### **What it does:**
- Enterprise-grade Solana RPC
- Better uptime and performance than public RPC

### **How to get it:**

**Step 5.1: Sign up**

Visit: https://www.alchemy.com/

1. Click "Get Started"
2. Sign up
3. Select "Solana"
4. Get API key

**Step 5.2: Use it**

```typescript
const alchemyUrl = 'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY'
const connection = new Connection(alchemyUrl)
```

---

## 📝 QUICK REFERENCE TABLE

| API | Purpose | Cost | Signup | Auth Required |
|-----|---------|------|--------|---------------|
| **CoinGecko** | Token prices | FREE | No | No ✅ |
| **TradingView** | Charts | FREE | No | No ✅ |
| **Solana RPC** | On-chain data | FREE | No | No ✅ |
| **Helius** | Better RPC | FREE tier | Yes (5 min) | Yes |
| **Moralis** | Wallet data | FREE tier | Yes (5 min) | Yes |
| **Alchemy** | Premium RPC | FREE tier | Yes (5 min) | Yes |

---

## 🚀 FULL IMPLEMENTATION EXAMPLE

Here's how to use all three together:

```typescript
// hooks/use-full-market-data.ts
import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'

export function useFullMarketData() {
  const [prices, setPrices] = useState({})
  const [walletData, setWalletData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        // 1. Get prices from CoinGecko (NO AUTH)
        const pricesRes = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin&vs_currencies=usd'
        )
        const pricesData = await pricesRes.json()
        setPrices(pricesData)

        // 2. Get Solana data from public RPC (NO AUTH)
        const connection = new Connection('https://api.devnet.solana.com')
        const slot = await connection.getSlot()
        
        setWalletData({ slot, rpc: 'Connected' })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchAll()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAll, 30000)
    return () => clearInterval(interval)
  }, [])

  return { prices, walletData, loading }
}
```

---

## ✅ PRIORITY ORDER (Start Here)

1. ✅ **CoinGecko** - Takes 2 minutes, no signup
2. ✅ **TradingView** - Takes 5 minutes, no signup
3. ✅ **Solana RPC** - Already working!
4. ⏳ **Helius** (Optional) - Better performance
5. ⏳ **Moralis** (Optional) - More data

---

## 🎯 START WITH THIS SIMPLE TEST

Add to your dashboard right now:

```typescript
// Quick test - add to any component
useEffect(() => {
  fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd')
    .then(r => r.json())
    .then(data => console.log('SOL Price:', data.solana.usd))
}, [])
```

Open browser console → see SOL price! 🎉

---

## 📞 TROUBLESHOOTING

**Q: "CORS Error" when fetching?**
A: Use a CORS proxy or backend endpoint

**Q: Rate limited by CoinGecko?**
A: Add delay between requests or upgrade to paid plan

**Q: Need more than free tier?**
A: All have generous free tiers for development

---

## 🎓 NEXT STEPS

1. Add CoinGecko to your `use-market-data.ts`
2. Add TradingView chart component
3. Display real-time prices on dashboard
4. Connect your Solana program data

---

**You're ready to integrate! Start with CoinGecko - no signup needed!** 🚀
