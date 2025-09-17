import { Body, Controller, Get, Post, Req, Res, UseFilters, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthService } from './auth.service';
import Public from './decorators/public.decorator';
import { Roles } from './decorators/role.decorator';
import { GoogleTokenErrorFilter } from './filters/google-token-error.filter';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Req() req: Request) {
    return this.authService.login(req.user!);
  }

  @Post('signout')
  logout(@Req() req: Request) {
    return this.authService.logout(req.user!.id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('protected')
  getAll(@Req() req: Request) {
    return `Now you can see this because you're authenticated. This is your ID: ${req.user?.id}`;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req.user!);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @UseFilters(GoogleTokenErrorFilter)
  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    // console.log({ user: req.user });
    const response = await this.authService.login(req.user!);
    const searchParams = new URLSearchParams({
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      userId: response.user.id,
      name: response.user.name,
      role: response.user.role
    });
    return res.redirect(`http://localhost:8000/?${searchParams}`);
  }
}
