import { Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { achievement } from './interfaceAchievement';

export class AchievementService {
	static achievement : achievement[] = [
		{
			title: "Rookie",
			description: "Obtained after winning a game for the first time"
		},
		{
			title: "Fashion Victim",
			description: "Obtained after updating avatar for the first time"
		},
		{
			title: "Thirst For Blood",
			description: "You played a game with Greed mode enabled"
		},
		{
			title: "Noob",
			description: "Obtained after loosing for the first time"
		},
		{
			title: "Chatty",
			description: "You're talking too much..."
		},
		{
			title: "You're a wizard",
			description: "Would you like to see a magic trick?"
		}
	];

	getAchievements(@Res() res: Response) : void {
		res.json(AchievementService.achievement);
	}

	getAchievement(@Req() req: Request, @Res() res: Response) : void {
		for(var i = 0; i < (AchievementService.achievement).length; i++) {
			if (AchievementService.achievement[i].title === req.header('achievement')) {
				res.json(AchievementService.achievement[i]);
				break;
			}
		}
	};

	getAchievementForMedal(title: string) : string {
		for(var i = 0; i < (AchievementService.achievement).length; i++) {
			if (AchievementService.achievement[i].title === title)
				return (AchievementService.achievement[i].description);
		}
		return null;
	};
}
