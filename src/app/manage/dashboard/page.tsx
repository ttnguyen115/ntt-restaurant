import { cookies } from 'next/headers';

import { accountApiRequest } from '@/apiRequests';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import DashboardMain from './DashboardMain';

async function Dashboard() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value as string;

    let name = '';

    try {
        const {
            payload: { data: myAccount },
        } = await accountApiRequest.sMe(accessToken);
        name = myAccount.name;
    } catch (error: any) {
        if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    }

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Dashboard {name}</CardTitle>
                        <CardDescription>Phân tích các chỉ số</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DashboardMain />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

export default Dashboard;
