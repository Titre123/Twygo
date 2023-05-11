import sha1 from 'sha1';
import jwt from 'jsonwebtoken';
import { AuthError, InternalServerError  } from '../../commons/error';
import { userPayload } from '../../modules/auth/auth.interface';

const secret: string | undefined = process.env.JWT_SECRET;

if(!secret) { throw new InternalServerError("JWT SECRET HAS NO VALUE!")};

const comparePassword = (password: string) => {
  return sha1(password) === password;
};

const createJWT = (user: userPayload ) => {
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role}, secret, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const verifyJWT = (token: string): userPayload=>{
  try {
    const payload = jwt.verify(token, secret);
    return payload as userPayload;

  } catch (e) {
    throw new AuthError('Invalid Token Provided');
  }
}

export { createJWT, comparePassword, verifyJWT };