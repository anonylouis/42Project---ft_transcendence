import { Injectable, ForbiddenException, Req, Res, Body, StreamableFile } from '@nestjs/common';
import { Request, Response } from 'express';
import { AchievementService } from '../achievement/achievement.service'
import { PrismaService} from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { HistoryBack } from './interfaceHistory';
import { join } from 'path';

@Injectable()
export class HistoryService {
	constructor(
		private prisma: PrismaService,
	) {}

	async getHistory(@Req() req: Request) : Promise<any> {
		try {
			const userLogin = req.header('id')

			const user = await this.prisma.history.findMany({where: {userId: userLogin}});
			if (!user) {
				return false
			}
			var fs = require('fs');
			let tab : HistoryBack[] = JSON.parse(JSON.stringify(user));
			for (let element of tab) {
				let enemyUser = await this.prisma.user.findUnique({where: {id: element.enemyLogin}});
				if (!enemyUser)
				{
					element.enemyLogin = "DeletedUser";
					element.enemyAvatar = undefined;
				}
				else
				{
					element.enemyLogin = enemyUser.login;
					element.enemyAvatar = fs.readFileSync(join(process.cwd(), enemyUser.avatar), 'base64');
				}
			}
			return tab;

		} catch(error) {
			if (error instanceof PrismaClientKnownRequestError) {
				if (error.code === 'P2002') {
					throw new ForbiddenException(
						'Can\'t find History',
					)
				}
			}
			throw error;
		}
	}

}
