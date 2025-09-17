import { Catch, ExceptionFilter, ArgumentsHost, UnauthorizedException } from '@nestjs/common';
import { TokenError } from 'passport-oauth2';

@Catch(TokenError)
export class GoogleTokenErrorFilter implements ExceptionFilter {
  catch(exception: TokenError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();

    throw new UnauthorizedException('Invalid or expired Google token');
  }
}
