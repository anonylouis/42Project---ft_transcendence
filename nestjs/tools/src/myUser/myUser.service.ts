import { Injectable, Req, Res, Body, UploadedFile, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { join } from 'path';


@Injectable()
export class MyUserService {
	constructor(
		private prisma: PrismaService,
		private jwt: JwtService,
	) {}


	async getIdByLogin(login: string) : Promise<any> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					login,
				},
			})
			if (!user) {
				return null
			}

			return user.id;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Can\'t find this user',
					)
				}
			}
			throw error;
		}
	}

	async getLoginById(id: string) : Promise<any> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id,
				},
			});
			if (!user)
				return null;
			return user.login;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'No login',
					)
				}
			}
			throw error;
		}
	}

	async getProfileById(id: string) : Promise<any> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id,
				},
			})
			if (!user) {
				return null;
			}
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

	async getAvatarFromId(id: string) : Promise<string> {
		try {
			const user = await this.prisma.user.findUnique({
				where: {
					id,
				},
			})
			if (!user) {
				return 'src/datas/uploads/defaultAvatar.jpeg';
			}
			return user.avatar;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'cant find avatar',
					)
				}
			}
			throw error;
		}
	}

	async putProfile(user: User, password: string, email: string, info: string) : Promise<any> {
		try {
			let oldHash = user.hash;
			if (password != null)
				oldHash = await argon.hash(password);
			let oldEmail = user.email;
			if (email != null)
				oldEmail = email;
			let oldInfo = user.info;
			if (info != null)
				oldInfo = info;
			const ret = await this.prisma.user.update({
				where: {
					id: user.id,
				},
				data: {
					email: oldEmail,
					hash: oldHash,
					info: oldInfo,
				},
			})
			return ret;
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

	async changeRoom(roomId: number, roomName: string, userId: string) : Promise<any> {
		try {
			const user = await this.prisma.user.update({
				where: {
					id: userId,
				},
				data: {
					currentRoomId: roomId,
					currentRoomName: roomName,
				},
			})
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

	async updateTwoFaAuth(idUser: string, new_bool: boolean) {
		const ret = await this.prisma.user.update({
			where: {
				id: idUser,
			},
			data: {
				isTwoFaAuthEnabled: new_bool,
			},
		});
		return ret;
	}
}
