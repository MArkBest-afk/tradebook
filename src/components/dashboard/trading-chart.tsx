"use client"

import * as React from "react"
import { Line, LineChart, CartesianGrid, XAxis, Tooltip, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartTooltipContent } from "@/components/ui/chart"
import { useLanguage } from "@/contexts/language-context"
import { Skeleton } from "../ui/skeleton"

type ChartData = {
  date: string
  price: number
  movingAverage: number
}

function generateChartData(): ChartData[] {
  const data: ChartData[] = []
  let price = 50000
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - 30)

  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    price += (Math.random() - 0.5) * 2000
    price = Math.max(price, 10000) // Ensure price doesn't go below 10k
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(2)),
      movingAverage: 0,
    })
  }

  // Calculate 5-day moving average
  for (let i = 0; i < data.length; i++) {
    if (i >= 4) {
      const sum = data.slice(i - 4, i + 1).reduce((acc, val) => acc + val.price, 0)
      data[i].movingAverage = parseFloat((sum / 5).toFixed(2))
    } else {
      data[i].movingAverage = data[i].price
    }
  }

  return data
}

export function TradingChart({ onPriceUpdate }: { onPriceUpdate: (price: number) => void }) {
  const { t } = useLanguage()
  const [data, setData] = React.useState<ChartData[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    const generatedData = generateChartData()
    setData(generatedData)
    if (generatedData.length > 0) {
        onPriceUpdate(generatedData[generatedData.length - 1].price)
    }
    setIsLoading(false)
  }, [onPriceUpdate])

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-[400px] w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('trading_chart')}</CardTitle>
        <CardDescription>{t('asset')}: BTC/USD</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                top: 5,
                right: 10,
                left: -10,
                bottom: 0,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
                />
                <Tooltip
                    cursor={{ stroke: 'hsl(var(--accent))', strokeWidth: 2, strokeDasharray: '3 3' }}
                    content={<ChartTooltipContent 
                        formatter={(value, name) => (
                            <div className="flex flex-col">
                                <span className="text-xs capitalize text-muted-foreground">{name === 'movingAverage' ? '5-Day MA' : 'Price'}</span>
                                <span className="font-bold">{`$${Number(value).toLocaleString()}`}</span>
                            </div>
                        )}
                        labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                    name="Price"
                />
                 <Line
                    type="monotone"
                    dataKey="movingAverage"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={false}
                    name="5-Day MA"
                    strokeDasharray="5 5"
                />
            </LineChart>
            </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
