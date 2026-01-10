import { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'

interface RegistrationsByDateChartProps {
  data: Record<string, number>
}

const chartConfig = {
  registration: {
    label: 'Registrations',
    color: 'var(--chart-7)',
  },
} satisfies ChartConfig

function RegistrationsByDateChart({ data }: RegistrationsByDateChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registration Trends</CardTitle>
        <CardDescription>
          Daily breakdown of participant sign-ups
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="count"
              type="natural"
              stroke={chartConfig.registration.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RegistrationsByDateChart
