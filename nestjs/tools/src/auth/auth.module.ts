import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SocketEvents } from '../socket/socketEvents';
import { MessageService } from '../message/message.service';
import { BlockService } from '../block/block.service';
import { MemberService } from '../member/member.service';
import { RoomService } from '../room/room.service';
import { AdminService } from '../admin/admin.service';
import { MyUserController } from '../myUser/myUser.controller';
import { MyUserService } from '../myUser/myUser.service';
import { JwtStrategy } from './strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
	imports: [JwtModule.register({}), PassportModule, HttpModule],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, SocketEvents, MessageService, MyUserController, RoomService, MemberService, AdminService, MyUserService, BlockService],
})

export class AuthModule {}
