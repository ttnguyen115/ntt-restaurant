import { http } from '@/lib';

import type { UploadImageResType } from '@/schemaValidations';

const API_MEDIA_UPLOAD = '/media/upload';

const mediaApiRequest = {
    upload: (formData: FormData) => {
        return http.post<UploadImageResType>(API_MEDIA_UPLOAD, formData);
    },
};

export default mediaApiRequest;
