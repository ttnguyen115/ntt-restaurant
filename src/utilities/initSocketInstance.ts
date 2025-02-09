import { io } from 'socket.io-client';

import envConfig from '@/config';

function initSocketInstance(accessToken: string) {
    return io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
        auth: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
}

export default initSocketInstance;
