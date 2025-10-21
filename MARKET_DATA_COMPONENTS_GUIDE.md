# 📊 Market Data Components Guide

You now have **2 new production-ready components** for displaying real-time market data!

---

## 📦 What You Have

### **1. MarketDataDisplay Component** 💹
- **File**: `components/market-data-display.tsx`
- **What it does**: Displays real-time token prices (SOL, BTC, ETH)
- **Features**:
  - Live prices from CoinGecko API (no auth needed!)
  - 24h change percentage with up/down indicators
  - Beautiful gradient cards
  - Auto-refreshes every 30 seconds
  - Loading states & error handling

### **2. TradingChart Component** 📈
- **File**: `components/trading-chart.tsx`
- **What it does**: Displays interactive candlestick charts
- **Features**:
  - Professional charting using lightweight-charts
  - Candlestick data visualization
  - Moving average overlay
  - Responsive resizing
  - Dark theme styling

---

## 🚀 How to Use Them

### **Step 1: Install lightweight-charts (for charts)**

```bash
npm install lightweight-charts
```

### **Step 2: Add to Your Dashboard**

Open `app/page.tsx` or `components/dashboard.tsx`:

```typescript
import { MarketDataDisplay } from "@/components/market-data-display"
import { TradingChart } from "@/components/trading-chart"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Market Data Display */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
        <MarketDataDisplay />
      </div>

      {/* Trading Chart */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Price Charts</h2>
        <TradingChart />
      </div>

      {/* Your other dashboard components */}
    </div>
  )
}
```

### **Step 3: Done!** ✅

Your dashboard now displays:
- ✅ Real-time token prices
- ✅ Professional trading charts
- ✅ Auto-updating data every 30 seconds

---

## 🎨 Component Details

### **MarketDataDisplay**

Shows **3 token cards** with:
- Token symbol (SOL, BTC, ETH)
- Current USD price
- 24-hour change percentage
- Up/down trend indicator
- Color-coded badges (green=up, red=down)

**Example Output:**
```
┌──────────────────────────────────┐
│ SOL                     ▲ +2.50% │
│ Solana                           │
│ $142.50                          │
│ +2.50% 24h                       │
└──────────────────────────────────┘
```

### **TradingChart**

Shows **candlestick chart** with:
- 10 days of sample data (customize with your data)
- Green candles = price up
- Red candles = price down
- Blue line = moving average
- Responsive sizing
- Zoom/pan enabled

---

## 🔧 Customization

### **Add More Tokens to MarketDataDisplay**

Edit `components/market-data-display.tsx`:

```typescript
const tokens = [
  { id: "solana", name: "Solana", symbol: "SOL", color: "from-purple-500 to-purple-600" },
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", color: "from-orange-500 to-orange-600" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", color: "from-blue-500 to-blue-600" },
  // Add more tokens here:
  // { id: "cardano", name: "Cardano", symbol: "ADA", color: "from-blue-400 to-blue-500" },
]
```

### **Connect Real Market Data to Chart**

Replace the sample data in `components/trading-chart.tsx`:

```typescript
// Replace this:
const sampleData = [...]

// With this (fetch real data):
const [chartData, setChartData] = useState([])

useEffect(() => {
  // Fetch from CoinGecko historical API
  fetch('https://api.coingecko.com/api/v3/coins/solana/market_chart?vs_currency=usd&days=10')
    .then(r => r.json())
    .then(data => {
      const formattedData = data.prices.map(([timestamp, price]) => ({
        time: new Date(timestamp).toISOString().split('T')[0],
        value: price
      }))
      setChartData(formattedData)
    })
}, [])
```

---

## 📱 Responsive Behavior

Both components are fully responsive:
- **Desktop**: 3-column grid for market data, full-width chart
- **Tablet**: 2-column or stacked layout
- **Mobile**: Single column, optimized card sizes

---

## 🔄 Real-Time Data Integration

### **Option 1: Use CoinGecko (Easiest)**
```typescript
// Already integrated!
// Refreshes every 30 seconds
// No API key needed
```

### **Option 2: Use Your Solana Programs**
```typescript
// Replace CoinGecko fetch with your program data:
const connection = new Connection('https://api.devnet.solana.com')
const programData = await connection.getProgramAccounts(yourProgramId)
// Parse and display...
```

### **Option 3: Combine Both**
```typescript
// CoinGecko for reference prices
// Your programs for live order book
// Display both on dashboard
```

---

## ⚡ Performance Tips

1. **Memoize components** if they update frequently
2. **Debounce chart updates** to prevent flickering
3. **Use `useSWR`** for better data fetching
4. **Cache market data** with Redis/localStorage

---

## 🎯 Next Steps

1. ✅ Install `lightweight-charts`
2. ✅ Add components to your dashboard
3. ✅ Customize token list
4. ✅ Connect real market data
5. ✅ Deploy to Vercel

---

## 📖 Example Full Dashboard Integration

```typescript
// components/dashboard.tsx
"use client"

import { MarketDataDisplay } from "@/components/market-data-display"
import { TradingChart } from "@/components/trading-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Percolator DEX</h1>
        <p className="text-gray-400 mt-2">Professional Trading Platform</p>
      </div>

      {/* Market Overview Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Market Overview</h2>
        <MarketDataDisplay />
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">SOL Trading Chart</h2>
          <TradingChart />
        </div>

        {/* Add more charts here */}
      </section>

      {/* Your other dashboard sections */}
    </div>
  )
}
```

---

## ✅ Features Included

- ✅ Real-time data fetching
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-refresh (30s interval)
- ✅ Responsive design
- ✅ Dark theme
- ✅ Beautiful UI with Radix
- ✅ TypeScript types

---

## 🐛 Troubleshooting

**Q: "lightweight-charts not found"**
- Run: `npm install lightweight-charts`

**Q: "CORS error when fetching data"**
- CoinGecko is CORS-enabled
- If still failing, use a CORS proxy or backend endpoint

**Q: "Chart not rendering"**
- Check that container ref is properly mounted
- Verify canvas is not hidden by CSS
- Check browser console for errors

---

**Your dashboard now has professional market data displays!** 🚀

Components are live on GitHub and auto-deployed to Vercel. ✅
