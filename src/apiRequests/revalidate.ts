import { http } from '@/lib';

const revalidateApiRequest = (tag: string) => {
    return http.get(`/api/revalidate?tag=${tag}`, {
        baseUrl: '',
    });
};

export default revalidateApiRequest;
