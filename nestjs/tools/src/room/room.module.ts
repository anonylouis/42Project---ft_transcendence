import { Module } from '@nestjs/common';
import { RoomController } from './room.controller';
import { RoomService } from './room.service';
import { AdminService } from '../admin/admin.service';
import { MemberService } from '../member/member.service';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [RoomController],
	providers: [RoomService, MemberService, AdminService],
})

export class RoomModule {}
