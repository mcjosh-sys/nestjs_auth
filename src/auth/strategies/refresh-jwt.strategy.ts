import { Inject, Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { type ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { type AuthJwtPayload } from '../types/auth-jwtPayload';
import { type Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  constructor(
    private readonly authService: AuthService,
    @Inject(refreshJwtConfig.KEY)
     readonly refreshTokenConfigs: ConfigType<typeof refreshJwtConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
      secretOrKey: refreshTokenConfigs.secret!,
      ignoreExpiration: false,
      passReqToCallback: true
    });
  }

  async validate(@Req() req: Request, payload: AuthJwtPayload) {
    const userId = payload.sub;
    const refreshToken = req.body.refreshToken;
    return this.authService.validateRefreshToken(userId, refreshToken);
  }
}
