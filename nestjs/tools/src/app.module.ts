import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MedalModule } from './medal/medal.module';
import { HistoryModule } from './history/history.module';
import { AdminModule } from './admin/admin.module';
import { MyUserModule } from './myUser/myUser.module';
import { FriendModule } from './friend/friend.module';
import { BlockModule } from './block/block.module';
import { RoomModule } from './room/room.module';
import { MessageModule } from './message/message.module';
import { MemberModule } from './member/member.module';
import { AchievementModule } from './achievement/achievement.module';
import { SocketModule } from './socket/socket.module';
import { GameModule } from './game/game.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		HttpModule,
		AuthModule,
		RoomModule,
		MessageModule,
		MemberModule,
		MyUserModule,
		FriendModule,
		BlockModule,
		AdminModule,
		MedalModule,
		AchievementModule,
		HistoryModule,
		SocketModule,
		GameModule,
		PrismaModule,
	],
})

export class AppModule {}
