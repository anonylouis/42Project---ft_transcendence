import { Injectable, ForbiddenException, Req, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService} from '../prisma/prisma.service';
import { RoomService} from '../room/room.service';
import { MemberService} from '../member/member.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { AuthDto } from './dto';
import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import { User } from '@prisma/client';
import { toDataUrl } from 'qrcode';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
		private config: ConfigService,
		private roomService: RoomService,
		private memberService: MemberService,
	) {}

	async createUser(email: string, login: string, password: string, info: any) {
		const hash = await argon.hash(password);
		try {
			const user = await this.prisma.user.create({
				data: {
					email,
					login,
					hash,
					info
				},
			});
			const generalMember = await this.memberService.createMember(1, "General Chat", user.id);
			const roomHash = await argon.hash('onsenfou');
			const whispRoom = await this.roomService.createRoom(user.login, roomHash, user.id, true);
			const inviteName = "invite-"+user.id;
			const inviteRoom = await this.roomService.createRoom(inviteName, roomHash, user.id, true);
			return user;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Credentials taken',
					)
				}
			}
			throw error;
		}
	}

	async signup(dto: AuthDto) {
		try {
			const email = ""+dto.email;
			const login = ""+dto.login;
			const create = await this.createUser(email, login, dto.password, dto.info);
			if (create)
				return this.signToken(create.id, create.email);
			else
				throw new ForbiddenException('Create ressource failed');
		} catch(error) {
			throw new ForbiddenException('Ressource access denied');
		}
	}

	async signin(dto: AuthDto) {
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{email: dto.email}, {login: dto.login}]
			}
		});
		if (!user) throw new ForbiddenException(
			'Credentials incorrect',
		);
		const pwMatches = await argon.verify(
			user.hash,
			dto.password,
		);
		if (!pwMatches)
			throw new ForbiddenException(
				'Credentials incorrect',
			);
		return this.signToken(user.id, user.email);
	}

	async signWith42(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id,
			}
		});
		if (!user) throw new ForbiddenException(
			'Credentials incorrect',
		);
		return this.signToken(user.id, user.email);
	}

	async sign42(dto: any, @Res() res: Response): Promise<string> {
		const email42 = ""+dto.email;
		const login42 = ""+dto.login;
		const user = await this.prisma.user.findFirst({
			where: {
				OR: [{email: email42}, {login: login42}]
			}
		});
		if (!user) {
			const create = await this.createUser(email42, login42, dto.password, dto.info);
			if (create) {
				const update = await this.prisma.user.update({
					where: {
						id: create.id,
					},
					data: {
						avatar: dto.path,
					},
				})
				return create.id;
			}
			return "nobody";
		}
		return user.id;
	}

	async generateTwoFaAuthSecret(user: User) {
		const secret = authenticator.generateSecret();

		const otpAuthUrl = authenticator.keyuri(
			user.email,
			this.config.get('VITE_AUTH_APP_NAME'),
			secret,
		);

		const ret = await this.prisma.user.update({
			where: {
				email: user.email,
			},
			data: {
				twoFaAuthSecret: secret,
			},
		});

		return {secret, otpAuthUrl};
	}

	async generateQrCodeDataUrl(otpAuthUrl: string) {
		return toDataUrl(otpAuthUrl);
	}

	validateTwoFaAuthCode(twoFaAuthCode: string, secret_to_try: string) {
		return authenticator.verify({
			token: secret_to_try,
			secret: twoFaAuthCode
		});
	}

	async signToken(
		userId: string,
		email: string,
	): Promise<{ access_token: string }> {
		const payload = {
			sub: userId,
			email,
		};
		const secret = this.config.get('VITE_JWT_SECRET');

		const token = await this.jwt.signAsync(
			payload, {
			expiresIn: '3d',
			secret: secret,
		});

		return {
			access_token: token,
		};
	}
}
