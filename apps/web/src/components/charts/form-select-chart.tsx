'use client'

import { useMemo } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface SelectOptionData {
  option: string
  count: number
}

interface SelectAnalyticsBarChartProps {
  data: Array<SelectOptionData>
  title: string
}

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
]

export function SelectAnalyticsBarChart({
  data,
  title,
}: SelectAnalyticsBarChartProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const processedData = data.map((item, index) => ({
      ...item,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }))

    const config = {
      count: {
        label: 'Count',
      },
      ...processedData.reduce(
        (acc, item) => {
          acc[item.option] = {
            label: item.option,
            color: item.fill,
          }
          return acc
        },
        {} as Record<string, { label: string; color: string }>,
      ),
    } satisfies ChartConfig

    return { chartData: processedData, chartConfig: config }
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="option"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.length > 10 ? `${value.slice(0, 10)}...` : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                dataKey="count"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
