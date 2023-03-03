import { Module } from '@nestjs/common';
import { MedalController } from './medal.controller';
import { MedalService } from './medal.service';
import { AchievementService } from '../achievement/achievement.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [MedalController],
	providers: [MedalService, AchievementService],
})

export class MedalModule {}
