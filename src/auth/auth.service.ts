import { UserService } from '@/user/user.service';
import { User } from '@lib/generated/prisma';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { Request } from 'express';
import { CreateUserDto } from '../user/dto/create-user.dto';
import jwtRefreshConfig from './config/refresh-jwt.config';
import { AuthJwtPayload } from './types/auth-jwtPayload';

export type AuthUser = Exclude<Request['user'], undefined>

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwt: JwtService,
    @Inject(jwtRefreshConfig.KEY)
    private readonly refreshConfig: ConfigType<typeof jwtRefreshConfig>,
  ) {}

  private extractReqUser(user: User): Request['user'] {
    return {id: user.id, name: user.name, role: user.role}
  }

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(
      createUserDto.email,
    );
    if (existingUser)
      throw new ConflictException('A User with this email already exists');
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');
    const { id, name, role } = user;
    return { id, name, role };
  }

  async login(user: AuthUser) {
    const { accessToken, refreshToken } = await this.generateTokens(user.id);
    const hashedRt = await hash(refreshToken);
    const hashedAt = await hash(accessToken);
    await this.userService.updateTokens(user.id, hashedAt, hashedRt);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string) {
     await this.userService.updateTokens(userId, null, null)
     return {message: "User signed out"}
  }

  async generateTokens(userId: string) {
    const payload: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload),
      this.jwt.signAsync(payload, this.refreshConfig),
    ]);
    return { accessToken, refreshToken };
  }

  async validateJwtUser(userId: string, accessToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');

    if (!user.hashedAccessToken)
      throw new UnauthorizedException('Unauthorized');

    const isTokenValid = await verify(user.hashedAccessToken, accessToken);
    if (!isTokenValid) throw new UnauthorizedException('Invalid access token');

    const currentUser = this.extractReqUser(user);
    return currentUser;
  }

  async validateRefreshToken(userId: string, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User not found');
    if (!user.hashedRefreshToken)
      throw new UnauthorizedException('Unauthorized');

    const isTokenValid = await verify(user.hashedRefreshToken, refreshToken);
    if (!isTokenValid) throw new UnauthorizedException('Invalid refresh token');

    const currentUser = this.extractReqUser(user);
    return currentUser;
  }

  async refreshToken(user: AuthUser) {
    const { accessToken, refreshToken } = await this.generateTokens(user!.id);
    const hashedRt = await hash(refreshToken);
    const hashedAt = await hash(accessToken);
    await this.userService.updateTokens(user!.id, hashedAt, hashedRt);
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(googleUser.email);
    if (existingUser) return this.extractReqUser(existingUser);
    const newUser = await this.userService.create(googleUser);
    return this.extractReqUser(newUser);
  }
}
