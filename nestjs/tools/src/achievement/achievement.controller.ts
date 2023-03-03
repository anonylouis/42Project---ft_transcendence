import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AchievementService } from './achievement.service';

@Controller('achievement')
export class AchievementController {
	constructor(
		private achievementService: AchievementService,
	) {}

	@Get('all')
	getAchievements(@Res() res: Response) {
		return this.achievementService.getAchievements(res);
	};

	@Get()
	getAchievement(@Req() req: Request, @Res() res: Response) {
		return this.achievementService.getAchievement(req, res);
	};

	getAchievementForMedal(title: string) {
		return this.achievementService.getAchievementForMedal(title);
	};
}
