import {
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  @HttpCode(HttpStatus.OK)
  async login({ password, email }: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) throw new ForbiddenException('User not found');
    const pswMatch = await bcrypt.compareSync(password, user.hash);
    if (!pswMatch) throw new ForbiddenException('Email or Password mismatch');

    return this.signToken(user.id, user.email);
  }

  async signup({ password, email }: AuthDto) {
    try {
      const salt = await bcrypt.genSaltSync(10);
      const hash = await bcrypt.hashSync(password, salt);
      const user = await this.prisma.user.create({
        data: { email, hash },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('User already exist');
        }
      }

      throw error;
    }
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ acess_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const acess_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT_SECRET_KEY'),
    });
    return { acess_token };
  }
}
