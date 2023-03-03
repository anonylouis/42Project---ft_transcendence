import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { PassportStrategy } from '@nestjs/passport';
import {
	ExtractJwt,
	Strategy,
} from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy (
	Strategy,
	'jwt-any-name'
) {
	constructor(
		config: ConfigService,
		private prisma: PrismaService,
	) {
		super({
			jwtFromRequest:
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: config.get('VITE_JWT_SECRET'),
		});
	}
	async validate(payload: {
		sub: string;
		email: string;

	}) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: payload.sub,
			}
		});
		delete user.hash;
		return user;
	}
}
