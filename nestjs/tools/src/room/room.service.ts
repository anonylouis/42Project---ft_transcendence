import { Injectable, ForbiddenException, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { MemberService} from '../member/member.service';
import { AdminService} from '../admin/admin.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RoomDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class RoomService {
	constructor(
		private prisma: PrismaService,
		private memberService: MemberService,
		private adminService: AdminService,
	) {}

	async checkPassword(dto: RoomDto) {
		const room = await this.prisma.room.findUnique({
			where: {
				id: dto.roomId,
			}
		})
		if (!room)
			throw new ForbiddenException('No room found');
		const pwMatches = await argon.verify(
			room.hash,
			dto.password
		);
		if (!pwMatches)
			throw new ForbiddenException('Credentials incorrect');
		return true;
	}

	async getRooms() {
		return this.prisma.room.findMany({});
	}

	async getRoomByName(roomName: string) {
		return this.prisma.room.findUnique({
			where: {
				name: roomName,
			},
		});
	}

	async getRoomById(roomId: number) {
		return this.prisma.room.findUnique({
			where: {
				id: roomId,
			},
		});
	}

	async createRoom(name: string, hash: string,
					 userId: string, isWhisp: boolean) {
		if (name) {
			const alreadyExist = await this.prisma.room.findFirst({
				where: {
					name,
				}
			})
			if (alreadyExist) {
				throw new ForbiddenException(
					'Ressource already exist',
				);
			}
			const room = await this.prisma.room.create({
				data: {
					ownerId: userId,
					name,
					isWhisp,
					hash
				},
			});
			if (room) {
				const member = await this.memberService.createMember(room.id, room.name, userId);
				const futurAdmin = await this.prisma.user.findUnique({
					where: {
						id: userId
					}
				});
				const admin = await this.adminService.createAdmin(room.id, userId, futurAdmin.login);
				return room;
			}
			return null;
		}
		return null;
	}

	async editRoomById(isPrivate: boolean, hash: string, roomId: number) {
		const room = await this.prisma.room.findUnique({
			where: {
				id: roomId,
			},
		});
		if (!room) {
			throw new ForbiddenException(
				"Room doesn't exists",
			);
		}
		return this.prisma.room.update({
			where: {
				id: roomId,
			},
			data: {
				isPrivate,
				hash
			},
		});
	}

	async giveOwner(roomId: number, userId: string, ownerId: string) {
		const members = await this.prisma.member.findMany({
			where: {
				roomId,
			}
		})
		if (!members) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		return this.prisma.room.update({
			where: {
				id: roomId,
			},
			data: {
				ownerId,
			},
		});
	}
}
