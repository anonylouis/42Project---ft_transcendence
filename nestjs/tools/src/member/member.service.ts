import { Injectable, ForbiddenException, Req, Res, Body, StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Member } from './interfaceMember';
import { join } from 'path';

@Injectable()
export class MemberService {
	constructor(
		private prisma: PrismaService,
	) {}

	async getMembers(roomId: number) {
		try {
			const members = await this.prisma.member.findMany({
				where: {
					roomId,
				},
			});
			var fs = require('fs');
			let tab : Member[] = JSON.parse(JSON.stringify(members));

			for (let element of tab) {
				const memberUser = await this.prisma.user.findUnique({
					where: {id: element.userId}
				});
				if (!memberUser)
					element.avatar = undefined;
				else
					element.avatar = fs.readFileSync(join(process.cwd(), memberUser.avatar), 'base64');
			}
			return tab;
		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Can\'t find MembersList',
					)
				}
			}
			throw error;
		}
	}

	async createMember(roomId: number,
						roomName: string, userId: string) {
		const newMember = await this.prisma.user.findUnique({
			where: {
				id: userId,
			}
		})
		if (!newMember || newMember.id !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		const addMember = await this.prisma.member.create({
			data: {
				userId,
				roomName,
				roomId
			},
		});
		return addMember;
	}

	async getBans(roomId: number) {
		const banList = this.prisma.member.findMany({
			where: {
				roomId,
				unbanDate: {
					gte: new Date()
				},
			},
		});
		return banList;
	}

	async banMember(roomId: number, userId: string, unbanDate: Date) {
		const newBan = await this.prisma.member.findFirst({
			where: {
				userId,
				roomId
			}
		})
		if (!newBan || newBan.userId !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		const addBan = await this.prisma.member.update({
			where: {
				id: newBan.id
			},
			data: {
				unbanDate,
			},
		});
		return addBan;
	}

	async getMutes(roomId: number) {
		const muteList = this.prisma.member.findMany({
			where: {
				roomId,
				unmuteDate: {
					gte: new Date()
				},
			},
		});
		return muteList;
	}

	async muteMember(roomId: number, userId: string, unmuteDate: Date) {
		const newMute = await this.prisma.member.findFirst({
			where: {
				userId,
				roomId
			}
		})
		if (!newMute || newMute.userId !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		const addMute = await this.prisma.member.update({
			where: {
				id: newMute.id
			},
			data: {
				unmuteDate,
			},
		});
		return addMute;
	}

	async deleteMemberById(roomId: number, userId: string) {
		const oldMember = await this.prisma.member.findFirst({
			where: {
				userId,
				roomId
			},
		});
		if (!oldMember || oldMember.userId !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		return this.prisma.member.delete({
			where: {
				id: oldMember.id,
			},
		});
	}
}
