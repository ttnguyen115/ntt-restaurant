import { io } from 'socket.io-client';

import envConfig from '@/config';
import { getAccessTokenFromLocalStorage } from '@/utilities';

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${getAccessTokenFromLocalStorage()}`,
    },
});

export default socket;
