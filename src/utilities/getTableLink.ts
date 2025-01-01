import envConfig from '@/config';

const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
    return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token;
};

export default getTableLink;
