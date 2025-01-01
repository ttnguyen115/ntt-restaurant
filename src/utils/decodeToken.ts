import jwt from 'jsonwebtoken';

import type { TokenPayload } from '@/types';

const decodeToken = (token: string) => {
    return jwt.decode(token) as TokenPayload;
};

export default decodeToken;
