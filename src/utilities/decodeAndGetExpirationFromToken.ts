import jwt from 'jsonwebtoken';

function decodeAndGetExpirationFromToken(...args: string[]): Array<{ exp: number }> {
    return args.map((token) => jwt.decode(token) as { exp: number });
}

export default decodeAndGetExpirationFromToken;
