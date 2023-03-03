import { Module } from "@nestjs/common";
import { SocketEvents } from "./socketEvents";
import { MessageService } from "../message/message.service";
import { BlockService } from "../block/block.service";
import { MyUserService } from "../myUser/myUser.service";
import { JwtService } from "@nestjs/jwt";

@Module({
	providers: [SocketEvents, MessageService, BlockService, MyUserService, JwtService]
})

export class SocketModule {}
