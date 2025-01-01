import { TableStatus } from '@/constants';

const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
    switch (status) {
        case TableStatus.Available:
            return 'Có sẵn';
        case TableStatus.Reserved:
            return 'Đã đặt';
        default:
            return 'Ẩn';
    }
};

export default getVietnameseTableStatus;
