import { Injectable, ForbiddenException, Req, Res, Body } from '@nestjs/common';
import { Request, Response } from 'express';
import { AchievementService } from '../achievement/achievement.service'
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { CreateMedalDto, EditMedalDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class MedalService {
	constructor(
		private prisma: PrismaService,
		private achievement: AchievementService,
	) {}

	getMedals(userId: string) {
		return this.prisma.medal.findMany({
			where: {
				userId,
			},
		});
	}

	getMedalsByUserId(userId: string) {
		return this.prisma.medal.findMany({
			where: {
				userId,
			},
		});
	}

	async createMedal(title: string, userId: string) {
		const oldMedal = await this.prisma.medal.findFirst({
			where: {
				userId: userId,
				title
			},
		});
		if (oldMedal) {
			return oldMedal;
		}
		const description = this.achievement.getAchievementForMedal(title);

		if (description) {
			const medal = await this.prisma.medal.create({
				data: {
					userId,
					title,
					description
				},
			});
			return medal;
		}
		return oldMedal;
	}

	async editMedalById(userId: string, medalId: number, dto: EditMedalDto) {
		const medal = await this.prisma.medal.findUnique({
			where: {
				id: medalId,
			},
		});
		if (!medal || medal.userId !== userId) {
			throw new ForbiddenException(
				'Acces to resources denied',
			);
		}
		return this.prisma.medal.update({
			where: {
				id: medalId,
			},
			data: {
				...dto,
			},
		});
	}
}
