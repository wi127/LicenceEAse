"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { useEffect, useState } from "react"
import { getApplicationsChartData } from "@/action/chartDashboard"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Applications",
  },
} satisfies ChartConfig

export function ApplicationsChart() {
  const [data, setData] = useState<{ month: string; desktop: number }[]>([])
  const [status, setStatus] = useState<'approved' | 'rejected' | 'pending'>('approved')
  const [year, setYear] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    const fetchData = async () => {
      const res = await getApplicationsChartData(year, status)
      if (res.success && res.data) {
        setData(res.data)
      }
    }
    fetchData()
  }, [status, year])

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Applications</CardTitle>
          <div className="flex gap-2">
            <select
              className="bg-background border border-input rounded-md px-3 py-1 text-sm text-foreground"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              name="status"
              className="bg-background border border-input rounded-md px-3 py-1 text-sm text-foreground capitalize"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'approved' | 'rejected' | 'pending')}
            >
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="desktop"
              fill={status === 'approved' ? '#22c55e' : status === 'rejected' ? '#ef4444' : '#eab308'} // green-500, red-500, yellow-500
              radius={8}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing applications for {year}
        </div>
      </CardFooter>
    </Card>
  )
}
