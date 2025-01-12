import jwt from 'jsonwebtoken';

type DecodedToken = {
    exp: number;
    iat: number;
};

function decodeAndGetExpirationFromToken(...args: string[]): Array<DecodedToken> {
    return args.map((token) => jwt.decode(token) as DecodedToken);
}

export default decodeAndGetExpirationFromToken;
