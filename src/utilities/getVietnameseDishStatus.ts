import { DishStatus } from '@/constants';

const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
    switch (status) {
        case DishStatus.Available:
            return 'Có sẵn';
        case DishStatus.Unavailable:
            return 'Không có sẵn';
        default:
            return 'Ẩn';
    }
};

export default getVietnameseDishStatus;
