import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [FriendController],
	providers: [FriendService],
})

export class FriendModule {}
