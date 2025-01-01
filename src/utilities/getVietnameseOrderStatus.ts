import { OrderStatus } from '@/constants';

const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
    switch (status) {
        case OrderStatus.Delivered:
            return 'Đã phục vụ';
        case OrderStatus.Paid:
            return 'Đã thanh toán';
        case OrderStatus.Pending:
            return 'Chờ xử lý';
        case OrderStatus.Processing:
            return 'Đang nấu';
        default:
            return 'Từ chối';
    }
};

export default getVietnameseOrderStatus;
