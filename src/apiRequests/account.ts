import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import { AccountResType } from '@/schemaValidations';

const accountApiRequest = {
    me: () => http.get<AccountResType>(ApiRoutes.ME),
};

export default accountApiRequest;
