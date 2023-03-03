import {
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UseGuards,
	Header,
	HttpStatus,
	HttpCode,
	ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { MyUserService } from '../myUser/myUser.service';
import { JwtGuard } from './guard';
import { FtGuard } from './ft_guard';
import { AuthDto } from './dto';
import { toFileStream } from 'qrcode';
import { Server, Socket } from 'socket.io';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: MyUserService,
	) {}

	@Post('signup')
	signup(@Body() dto: AuthDto) {
		return this.authService.signup(dto);
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	signin(@Body() dto: AuthDto) {
		return this.authService.signin(dto);
	}

	@Get('signWith42')
	async signWith42(@Req() req: Request) {
		return this.authService.signWith42(req.header('id'));
	}

	@UseGuards(FtGuard)
	@Get('redirect')
	async ftRedirect(@Req() req: Request, @Res() res: Response) {
		const id = await this.authService.sign42(req.user, res);

		const REDIRECT_URL = "https://" + process.env.VITE_HOSTNAME + ":"
								+ process.env.VITE_PROXY_PORT
								+ "/acceptLogin42/" + id;

		res.redirect(302, REDIRECT_URL);
	}

	@UseGuards(FtGuard)
	@Get('check')
	ftCheck(@Req() req: Request, @Res() res: Response) {
		return { statusCode: 200};
	}

	@Post('2fa/generate')
	@UseGuards(JwtGuard)
	async register(@Res() res: Response, @GetUser() user: User) {
		const { otpAuthUrl } = await this.authService.generateTwoFaAuthSecret(user);
		return toFileStream(res, otpAuthUrl);
	}

	@Post('2fa/turn-on')
	@UseGuards(JwtGuard)
	async turnOnTwoFactorAuthentication(@GetUser('id') userId: string) {
		this.userService.updateTwoFaAuth(userId, true);
	}

	@Post('2fa/turn-off')
	@UseGuards(JwtGuard)
	async turnOffTwoFactorAuthentication(@GetUser('id') userId: string) {
		this.userService.updateTwoFaAuth(userId, false);
	}

	@Post('2fa/authenticate')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async authenticate(@Req() req: Request, @GetUser() user: User) {
		const isCodeValid = this.authService.validateTwoFaAuthCode(
			user.twoFaAuthSecret,
			req.header('code')
		);
		return isCodeValid;
	}
}
