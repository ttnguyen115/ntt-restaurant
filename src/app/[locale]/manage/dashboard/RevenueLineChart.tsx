'use client';

import { memo } from 'react';

import { format, parse } from 'date-fns';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
    desktop: {
        label: 'Desktop',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

function RevenueLineChart({ chartData = [] }: { chartData: { date: string; revenue: number }[] }) {
    const renderLineChart = (
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
                        if (chartData.length < 8) {
                            return value;
                        }
                        if (chartData.length < 33) {
                            const date = parse(value, 'dd/MM/yyyy', new Date());
                            return format(date, 'dd');
                        }
                        return '';
                    }}
                />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                />
                <Line
                    dataKey="revenue"
                    type="linear"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Doanh thu</CardTitle>
                {/* <CardDescription>January - June 2024</CardDescription> */}
            </CardHeader>
            <CardContent>{renderLineChart}</CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className='flex gap-2 font-medium leading-none'>
                    Trending up by 5.2% this month <TrendingUp className='h-4 w-4' />
                </div>
                <div className='leading-none text-muted-foreground'>
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    );
}

export default memo(RevenueLineChart);
