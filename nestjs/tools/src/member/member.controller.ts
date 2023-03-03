import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseUUIDPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { MemberService } from './member.service';

@UseGuards(JwtGuard)
@Controller('member')
export class MemberController {
	constructor(
		private memberService: MemberService,
	) {}

	@Get()
	getMembers(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		return this.memberService.getMembers(roomId);
	};

	@Get('ban')
	async getBans(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		return this.memberService.getBans(roomId);
	}

	@Put('ban')
	async banMember(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('new-ban');
		const until = parseInt(req.header('until'));
		let actual = new Date();
		const unbanDate = new Date(actual.getTime() + (until * (1000 * 60)));
		return this.memberService.banMember(roomId, userId, unbanDate);
	}

	@Get('mute')
	async getMutes(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		return this.memberService.getMutes(roomId);
	}

	@Put('mute')
	async muteMember(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('new-mute');
		const until = parseInt(req.header('until'));
		let actual = new Date();
		const unmuteDate = new Date(actual.getTime() + (until * (1000 * 60)));
		return this.memberService.muteMember(roomId, userId, unmuteDate);
	}

	@Post()
	createMember(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const roomName = req.header('roomName');
		const userId = req.header('new-member');
		return this.memberService.createMember(roomId, roomName, userId);
	}

	@Delete('leave')
	deleteMemberById(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('delete-member');
		return this.memberService.deleteMemberById(roomId, userId);
	};
}
