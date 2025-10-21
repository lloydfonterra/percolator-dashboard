# UI Customization & Branding Guide

Customize your Percolator DEX dashboard to match your brand and vision.

## 🎨 Color Scheme

### Edit Global Colors

File: `app/globals.css`

```css
@layer base {
  :root {
    /* Primary Brand Colors */
    --primary: #1e88e5;           /* Main CTA buttons */
    --primary-foreground: #ffffff;

    /* Secondary Accent */
    --secondary: #00bcd4;         /* Highlights, accents */
    --secondary-foreground: #ffffff;

    /* Backgrounds */
    --background: #0f1419;        /* Main background */
    --foreground: #e0e0e0;        /* Main text */

    /* Cards & Surfaces */
    --card: #1a1f26;
    --card-foreground: #e0e0e0;

    /* Status Colors */
    --success: #4caf50;           /* Profit, buy orders */
    --warning: #ff9800;           /* Caution, maintenance */
    --destructive: #f44336;       /* Loss, sell orders */

    /* Borders & Dividers */
    --muted: #4a4a4a;
    --border: #2a2a2a;
  }

  /* Light mode (optional) */
  [data-theme="light"] {
    --primary: #0066cc;
    --background: #ffffff;
    --foreground: #000000;
    --card: #f5f5f5;
  }
}
```

## 🏷️ Typography

### Update Font Family

File: `app/layout.tsx`

```tsx
import { Inter, JetBrains_Mono } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Add Font Weights

```css
@layer base {
  @font-face {
    font-family: "Montserrat";
    src: url("/fonts/montserrat-bold.woff2") format("woff2");
    font-weight: 700;
  }

  h1, h2, h3 {
    font-family: "Montserrat";
  }
}
```

## 🎬 Header/Navigation

### Custom Header Component

File: `components/custom-header.tsx`

```tsx
import { Wallet } from "lucide-react"

export function CustomHeader() {
  return (
    <header className="bg-gradient-to-r from-primary via-secondary to-primary border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold text-white">🌀</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Percolator DEX</h1>
            <p className="text-xs text-secondary/70">High-Performance Perpetual Futures</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex gap-8">
          <a href="#trading" className="text-foreground hover:text-primary transition">Trading</a>
          <a href="#markets" className="text-foreground hover:text-primary transition">Markets</a>
          <a href="#portfolio" className="text-foreground hover:text-primary transition">Portfolio</a>
          <a href="#docs" className="text-foreground hover:text-primary transition">Docs</a>
        </nav>

        {/* Wallet Button */}
        <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg transition">
          <Wallet size={20} />
          Connect Wallet
        </button>
      </div>
    </header>
  )
}
```

## 🎯 Dashboard Layout

### Update Dashboard Structure

File: `components/dashboard.tsx`

```tsx
import { CustomHeader } from "./custom-header"
import { Sidebar } from "./sidebar"
import { TradingPanel } from "./trading-panel"
import { PortfolioCard } from "./portfolio-card"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <CustomHeader />

      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6 max-w-7xl">
          {/* Portfolio Overview */}
          <section className="grid grid-cols-3 gap-4 mb-6">
            <PortfolioCard
              label="Collateral"
              value="$10,250.50"
              change="+2.5%"
              icon="💰"
            />
            <PortfolioCard
              label="Total PnL"
              value="$1,245.32"
              change="+12.3%"
              icon="📈"
            />
            <PortfolioCard
              label="Positions"
              value="3"
              change="2 Long, 1 Short"
              icon="📊"
            />
          </section>

          {/* Trading & Charts */}
          <section className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <TradingPanel />
            </div>
            <div>
              <OrderBook />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
```

## 🎨 Sidebar Customization

File: `components/sidebar.tsx`

```tsx
import { BarChart3, Zap, Settings, LogOut } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
      {/* Menu Items */}
      <nav className="space-y-2 flex-1">
        <SidebarItem icon={BarChart3} label="Dashboard" active />
        <SidebarItem icon={Zap} label="Trading" />
        <SidebarItem icon={BarChart3} label="Markets" />
      </nav>

      {/* Bottom Settings */}
      <div className="space-y-2 border-t border-border pt-4">
        <SidebarItem icon={Settings} label="Settings" />
        <SidebarItem icon={LogOut} label="Disconnect" />
      </div>
    </aside>
  )
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
}: {
  icon: any
  label: string
  active?: boolean
}) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-muted"
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  )
}
```

## 💳 Card Customization

### Beautiful Card Styles

```tsx
// components/ui/beautiful-card.tsx
export function BeautifulCard({
  title,
  children,
  gradient = false,
}: {
  title: string
  children: React.ReactNode
  gradient?: boolean
}) {
  return (
    <div
      className={`rounded-lg border border-border p-6 ${
        gradient
          ? "bg-gradient-to-br from-card to-card/50"
          : "bg-card"
      } hover:border-secondary/50 transition`}
    >
      <h2 className="text-lg font-bold mb-4 text-foreground">{title}</h2>
      {children}
    </div>
  )
}
```

## 📊 Chart Customization

### Recharts Theme

File: `components/market-chart.tsx`

```tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

const chartConfig = {
  margin: { top: 5, right: 30, left: 0, bottom: 5 },
  stroke: "#1e88e5",
  fill: "url(#colorGradient)",
}

export function MarketChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e88e5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1e88e5" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
        <XAxis dataKey="time" stroke="#4a4a4a" />
        <YAxis stroke="#4a4a4a" />

        <Tooltip
          contentStyle={{
            backgroundColor: "#1a1f26",
            border: "1px solid #2a2a2a",
            borderRadius: "8px",
          }}
          cursor={{ stroke: "#1e88e5" }}
        />

        <Line
          type="monotone"
          dataKey="price"
          stroke="#1e88e5"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

## 🎬 Animations

### Smooth Transitions

File: `app/globals.css`

```css
@layer base {
  * {
    @apply transition-colors duration-200;
  }

  /* Button animations */
  button {
    @apply hover:scale-105 active:scale-95 transition-transform;
  }

  /* Card hover */
  .card {
    @apply hover:shadow-lg hover:shadow-primary/20 transition-all;
  }

  /* Loading animation */
  @keyframes pulse-gradient {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .pulse-gradient {
    animation: pulse-gradient 2s ease-in-out infinite;
  }
}
```

## 🌙 Dark/Light Mode Toggle

File: `components/theme-toggle.tsx`

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const theme = isDark ? "dark" : "light"
    document.documentElement.setAttribute("data-theme", theme)
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-lg hover:bg-muted transition"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
```

## 📱 Responsive Design

### Mobile-First Classes

```css
/* Tailwind mobile-first approach */
.dashboard {
  @apply p-4 md:p-6 lg:p-8;
}

.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4;
}

.sidebar {
  @apply hidden md:block w-64;
}
```

## 🎯 Performance Optimizations

### Image Optimization

```tsx
import Image from "next/image"

export function Logo() {
  return (
    <Image
      src="/logo.png"
      alt="Percolator"
      width={40}
      height={40}
      priority
    />
  )
}
```

### Lazy Loading Charts

```tsx
import dynamic from "next/dynamic"

const MarketChart = dynamic(() => import("./market-chart"), {
  loading: () => <Skeleton className="h-64" />,
})
```

## 📚 Component Showcase

Add a component gallery page:

File: `app/components/page.tsx`

```tsx
export default function ComponentShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-12">Component Showcase</h1>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="flex gap-4">
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-secondary">Secondary</button>
          <button className="btn btn-destructive">Destructive</button>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-3 gap-4">
          <BeautifulCard title="Card 1" gradient>Content</BeautifulCard>
          <BeautifulCard title="Card 2">Content</BeautifulCard>
          <BeautifulCard title="Card 3" gradient>Content</BeautifulCard>
        </div>
      </section>
    </div>
  )
}
```

---

## 🚀 Deployment Tips

1. **Test colors** across light and dark modes
2. **Optimize images** before deploying
3. **Check accessibility** with WAVE tool
4. **Test on mobile** before pushing to production
5. **Monitor bundle size** - use `npm run build` to check

---

**Happy designing! 🎨**
