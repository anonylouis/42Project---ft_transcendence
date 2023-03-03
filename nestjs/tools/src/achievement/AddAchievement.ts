import { ForbiddenException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AchievementService } from "./achievement.service";


export async function addAchievement(prisma : PrismaService, userId : string, title : string) {
	const oldMedal = await prisma.medal.findFirst({
		where: {
			userId: userId,
			title
		},
	});
	if (oldMedal) {
		return ;
	}
	const description = new AchievementService().getAchievementForMedal(title);
	if (description) {
		const medal = await prisma.medal.create({
			data: {
				userId,
				title,
				description
			},
		});
	}
}
