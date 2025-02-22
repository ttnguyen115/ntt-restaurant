'use client';

import { memo, useCallback, useState } from 'react';

import { endOfDay, format, startOfDay } from 'date-fns';

import { formatCurrency } from '@/utilities';

import { useGetIndicators } from '@/hooks';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import DishBarChart from './DishBarChart';
import RevenueLineChart from './RevenueLineChart';

const DollarSign = memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
    >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
));

const CustomersSvg = memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle
            cx="9"
            cy="7"
            r="4"
        />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
));

const OrderSvg = memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
    >
        <rect
            width="20"
            height="14"
            x="2"
            y="5"
            rx="2"
        />
        <path d="M2 10h20" />
    </svg>
));

const ServingTableSvg = memo(() => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="h-4 w-4 text-muted-foreground"
    >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
));

const dashboardCards = ({
    revenue,
    guestCount,
    orderCount,
    servingTableCount,
}: {
    revenue: number;
    guestCount: number;
    orderCount: number;
    servingTableCount: number;
}) => [
    {
        id: 'revenue',
        title: 'Tổng doanh thu',
        count: formatCurrency(revenue),
        Icon: DollarSign,
    },
    {
        id: 'customers',
        title: 'Khách',
        subtitle: 'Gọi món',
        count: guestCount,
        Icon: CustomersSvg,
    },
    {
        id: 'orders',
        title: 'Đơn hàng',
        subtitle: 'Đã thanh toán',
        count: orderCount,
        Icon: OrderSvg,
    },
    {
        id: 'tables',
        title: 'Bàn đang phục vụ',
        count: servingTableCount,
        Icon: ServingTableSvg,
    },
];

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

function DashboardMain() {
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);

    const { data } = useGetIndicators({ fromDate, toDate });

    const {
        revenue = 0,
        guestCount = 0,
        orderCount = 0,
        servingTableCount = 0,
        revenueByDate = [],
        dishIndicator = [],
    } = data?.payload.data ?? {};

    const resetDateFilter = useCallback(() => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    }, []);

    const renderDateTimeFilter = (
        <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
                <span className="mr-2">Từ</span>
                <Input
                    type="datetime-local"
                    placeholder="Từ ngày"
                    className="text-sm"
                    value={format(fromDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                    onChange={(event) => setFromDate(new Date(event.target.value))}
                />
            </div>
            <div className="flex items-center">
                <span className="mr-2">Đến</span>
                <Input
                    type="datetime-local"
                    placeholder="Đến ngày"
                    value={format(toDate, 'yyyy-MM-dd HH:mm').replace(' ', 'T')}
                    onChange={(event) => setToDate(new Date(event.target.value))}
                />
            </div>
            <Button
                variant="outline"
                onClick={resetDateFilter}
            >
                Reset
            </Button>
        </div>
    );

    const renderDashboardCards = (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {dashboardCards({ revenue, guestCount, orderCount, servingTableCount }).map(
                ({ id, title, count, subtitle = '', Icon }) => (
                    <Card key={id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{title}</CardTitle>
                            <Icon />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{count}</div>
                            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    );

    const renderCharts = (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
                <RevenueLineChart chartData={revenueByDate} />
            </div>
            <div className="lg:col-span-3">
                <DishBarChart chartData={dishIndicator} />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            {renderDateTimeFilter}
            {renderDashboardCards}
            {renderCharts}
        </div>
    );
}

export default memo(DashboardMain);
