import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TwoFaStrategy extends PassportStrategy(Strategy, '2fa') {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret',
    });
  }

  async validate(payload: any) {
    const user = await this.prisma.user.findUnique({
	    where: {
		    email: payload.email
	    }
    });

    if (!user.isTwoFaAuthEnabled) {
      return user;
    }
    if (payload.isTwoFactorAuthenticated) {
      return user;
    }
  }
}
