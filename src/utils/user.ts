import {TokenService} from '@loopback/authentication';
import {HttpErrors, Request} from '@loopback/rest';

export const getUserInfo = async (
  request: Request,
  jwtService: TokenService,
) => {
  const token = request.headers['authorization']?.split(' ')[1];
  if (!token) {
    throw HttpErrors.Unauthorized('Error obteniendo información de usuario.');
  }
  const user = await jwtService.verifyToken(token);
  return user;
};
