import querystring from 'querystring';

import { Prefix } from '@/constants';

import { http } from '@/lib';

import type { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/schemaValidations';

const BACKEND_API = {
    INDICATOR_DASHBOARD: Prefix.INDICATOR_DASHBOARD,
};

const indicatorApiRequest = {
    getDashboardIndicator: (query: DashboardIndicatorQueryParamsType) => {
        const queryString = querystring.stringify({
            ...query,
            fromDate: query.fromDate.toISOString(),
            toDate: query.toDate.toISOString(),
        });
        return http.get<DashboardIndicatorResType>(`${BACKEND_API.INDICATOR_DASHBOARD}?${queryString}`);
    },
};

export default indicatorApiRequest;
