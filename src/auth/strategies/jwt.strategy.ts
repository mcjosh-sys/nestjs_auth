import { Inject, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import jwtConfig from '../config/jwt.config';
import { type AuthJwtPayload } from '../types/auth-jwtPayload';
import { type Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(jwtConfig.KEY)
    readonly jwtConfigs: ConfigType<typeof jwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfigs.secret!,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(@Req() req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub
    const accessToken = req.headers.authorization?.split(' ')[1];
    return this.authService.validateJwtUser(userId, accessToken!);
  }
}
