import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { UserLoginDto } from '../dto/user-login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    if (password === '') throw new UnauthorizedException('Invalid credentials');
    const dto = plainToInstance(UserLoginDto, { email, password });
    try {
      await validateOrReject(dto);
    } catch (errors) {
      const message = errors
        .map((err: any) => Object.values(err.constraints))
        .flat();
      throw new BadRequestException(message);
    }
    return this.authService.validateLocalUser(email, password);
  }
}
