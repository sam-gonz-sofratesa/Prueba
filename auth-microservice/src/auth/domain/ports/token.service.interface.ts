export interface JwtPayload {
  sub:             string;  // userId (MongoDB ObjectId)
  codigo_empleado: string;  // identificador del empleado
}

export interface TokenPair {
  accessToken:  string;
  refreshToken: string;
}

export interface ITokenService {
  generateTokens(payload: JwtPayload): TokenPair;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
