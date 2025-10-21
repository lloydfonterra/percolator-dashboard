"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const chartDataMap: Record<string, any[]> = {
  "SOL/USDC": [
    { time: "10:00", price: 145.2 },
    { time: "10:30", price: 146.5 },
    { time: "11:00", price: 144.8 },
    { time: "11:30", price: 147.2 },
    { time: "12:00", price: 148.5 },
    { time: "12:30", price: 147.9 },
    { time: "13:00", price: 149.2 },
  ],
  "BTC/USDC": [
    { time: "10:00", price: 42500 },
    { time: "10:30", price: 42800 },
    { time: "11:00", price: 42300 },
    { time: "11:30", price: 43100 },
    { time: "12:00", price: 43200 },
    { time: "12:30", price: 42900 },
    { time: "13:00", price: 43500 },
  ],
  "ETH/USDC": [
    { time: "10:00", price: 2400 },
    { time: "10:30", price: 2410 },
    { time: "11:00", price: 2390 },
    { time: "11:30", price: 2430 },
    { time: "12:00", price: 2420 },
    { time: "12:30", price: 2415 },
    { time: "13:00", price: 2440 },
  ],
  "ORCA/USDC": [
    { time: "10:00", price: 0.82 },
    { time: "10:30", price: 0.83 },
    { time: "11:00", price: 0.81 },
    { time: "11:30", price: 0.84 },
    { time: "12:00", price: 0.85 },
    { time: "12:30", price: 0.84 },
    { time: "13:00", price: 0.86 },
  ],
}

interface PriceChartProps {
  pair: string
}

export function PriceChart({ pair }: PriceChartProps) {
  const chartData = chartDataMap[pair] || chartDataMap["SOL/USDC"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pair}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="time" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
              }}
            />
            <Line type="monotone" dataKey="price" stroke="var(--color-primary)" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
