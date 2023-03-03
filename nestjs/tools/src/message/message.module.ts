import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { BlockService } from '../block/block.service';
import { MyUserService } from '../myUser/myUser.service';
import { JwtService } from '@nestjs/jwt';
import { NestjsFormDataModule } from 'nestjs-form-data';

@Module({
	imports: [
		NestjsFormDataModule,
	],
	controllers: [MessageController],
	providers: [MessageService, BlockService, MyUserService, JwtService],
})

export class MessageModule {}
