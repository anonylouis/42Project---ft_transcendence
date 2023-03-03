import { Injectable, ForbiddenException, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AdminService {
	constructor(
		private prisma: PrismaService,
	) {}

	getAdmins(roomId: number) {
		return this.prisma.admin.findMany({
			where: {
				roomId,
			},
		});
	}

	getAdminsByUserId(userId: string) {
		return this.prisma.admin.findMany({
			where: {
				userId,
			},
		});
	}

	async createAdmin(roomId: number,
						userId: string, userName: string) {
		const newAdmin = await this.prisma.user.findUnique({
			where: {
				id: userId
			}
		})
		if (!newAdmin || newAdmin?.id !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		const addAdmin = await this.prisma.admin.create({
			data: {
				userId,
				userName,
				roomId
			},
		});
		return addAdmin;
	}

	async deleteAdminById(roomId: number, userId: string) {
		const oldAdmin = await this.prisma.admin.findFirst({
			where: {
				userId,
				roomId
			},
		});
		if (!oldAdmin || oldAdmin.userId !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		await this.prisma.admin.delete({
			where: {
				id: oldAdmin.id,
			},
		});
		return this.prisma.admin.findMany({
			where: {
				roomId,
			},
		});
	}
}
