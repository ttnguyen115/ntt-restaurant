import { useQuery } from '@tanstack/react-query';

import { indicatorApiRequest } from '@/apiRequests';

import type { DashboardIndicatorQueryParamsType } from '@/schemaValidations';

export const useGetIndicators = (query: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryKey: ['indicators', query],
        queryFn: () => indicatorApiRequest.getDashboardIndicator(query),
    });
};
