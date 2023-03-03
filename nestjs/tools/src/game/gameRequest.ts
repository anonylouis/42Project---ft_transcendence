import { addAchievement } from "src/achievement/AddAchievement";
import { PrismaService } from "src/prisma/prisma.service";
import { EndScreenInfo } from "./interfaceGame";

async function addToHistory(prisma : PrismaService, userId : string, enemyLogin : string, userScore: number, enemyScore : number) {
	await prisma.history.create({
		data: {
			userId,
			enemyLogin,
			userScore,
			enemyScore
		},
	});
}

async function addVictory(prisma : PrismaService, userId : string, to_add: number) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			victories: {increment : to_add},
		}
	});
}
async function addLoss(prisma : PrismaService, userId : string, to_add: number) {
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			loses: {increment : to_add},
		}
	});
}

export async function addGameToHistory(prisma :PrismaService, r : EndScreenInfo) {
	addToHistory(prisma, r.player1, r.player2, r.score1, r.score2);
	addToHistory(prisma, r.player2, r.player1, r.score2, r.score1);

	let to_add = 1;
	if (r.mode =="greed") {
		to_add = 2;
	}

	if (r.score1 > r.score2) {
		addVictory(prisma, r.player1, to_add);
		addAchievement(prisma, r.player1, 'Rookie');
		addLoss(prisma, r.player2, to_add);
		addAchievement(prisma, r.player2, 'Noob');
	}
	else {
		addVictory(prisma, r.player2, to_add);
		addAchievement(prisma, r.player2, 'Rookie');
		addLoss(prisma, r.player1, to_add);
		addAchievement(prisma, r.player1, 'Noob');
	}

	if (r.mode == "greed") {
		addAchievement(prisma, r.player1, 'Thirst For Blood');
		addAchievement(prisma, r.player2, 'Thirst For Blood');
	}
	else if (r.mode == "magic") {
		addAchievement(prisma, r.player1, "You're a wizard");
		addAchievement(prisma, r.player2, "You're a wizard");
	}
}

export async function deprecatedInvitations(prisma :PrismaService, id : string , ToJoinId: string) {
	await prisma.message.updateMany({
		where: {
		  receveir: {
			contains: id,
		  },
		  message: {
			contains: ToJoinId,
		  },
		},
		data: {
		  message: "Deprecated Invitation !",
		},
	  })
}

export async function deprecatedInvitationsStart(prisma :PrismaService, id : string) {
	await prisma.message.updateMany({
		where: {
		  message: {
			contains: id,
		  },
		},
		data: {
		  message: "Deprecated Invitation !",
		},
	  })
}

export async function getLogin(prisma :PrismaService, id : string) {
	const user = await prisma.user.findUnique({
		where: {
			id: id,
		}
	})
	return user.login;
}
