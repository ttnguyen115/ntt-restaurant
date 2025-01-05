import { ApiRoutes } from '@/constants';

import { http } from '@/lib';

import type { UploadImageResType } from '@/schemaValidations';

const mediaApiRequest = {
    upload: (formData: FormData) => http.post<UploadImageResType>(ApiRoutes.MEDIA_UPLOAD, formData),
};

export default mediaApiRequest;
