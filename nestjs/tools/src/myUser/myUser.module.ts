import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MyUserController } from './myUser.controller';
import { MyUserService } from './myUser.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
	imports: [
		JwtModule.register({}),
		MulterModule.register({ dest: './src/datas/uploads' })
	],
	controllers: [MyUserController],
	providers: [MyUserService],
})

export class MyUserModule {}
