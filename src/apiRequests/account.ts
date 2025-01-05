import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import { AccountResType, UpdateMeBodyType } from '@/schemaValidations';

const accountApiRequest = {
    me: () => http.get<AccountResType>(ApiRoutes.ME),

    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>(ApiRoutes.ME, body),
};

export default accountApiRequest;
