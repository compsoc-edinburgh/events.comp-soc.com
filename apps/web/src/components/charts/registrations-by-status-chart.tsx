import { useMemo } from 'react'
import { Pie, PieChart } from 'recharts'
import type { ChartConfig } from '@/components/ui/chart.tsx'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx'

interface RegistrationByStatusProps {
  data: Record<string, number>
  totalCount: number
}

const chartConfig = {
  waitlist: {
    label: 'Waitlist',
    color: 'var(--color-status-waitlist)',
  },
  rejected: {
    label: 'Rejected',
    color: 'var(--color-status-rejected)',
  },
  pending: {
    label: 'Pending',
    color: 'var(--color-status-pending)',
  },
  accepted: {
    label: 'Accepted',
    color: 'var(--color-status-accepted)',
  },
} satisfies ChartConfig

function RegistrationByStatus({ data, totalCount }: RegistrationByStatusProps) {
  const { chartData } = useMemo(() => {
    const processedData = Object.entries(data).map(([status, count]) => {
      const configKey = status as keyof typeof chartConfig
      const color = chartConfig[configKey].color || 'var(--color-muted)'

      return {
        status,
        count,
        fill: color,
      }
    })

    return { chartData: processedData }
  }, [data])

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Registration Composition</CardTitle>
        <CardDescription>
          Total Registrations: {totalCount.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5 pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="count" label nameKey="status" />
            <ChartLegend
              content={<ChartLegendContent nameKey="status" />}
              className="flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default RegistrationByStatus
