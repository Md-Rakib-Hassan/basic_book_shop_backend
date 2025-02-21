import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayload: { Email: string; Role: string },
  secret: string,
  expiresIn: string,
) => jwt.sign(jwtPayload, secret, { expiresIn });
