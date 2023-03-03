import { Body, Injectable, Controller, UseGuards, Get, Post, Patch, Put, Delete, Req, Res, Param, ParseUUIDPipe } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { Express, Request, Response } from 'express';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AdminService } from './admin.service';

@UseGuards(JwtGuard)
@Controller('admin')
export class AdminController {
	constructor(
		private adminService: AdminService,
	) {}

	@Get()
	getAdmins(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		return this.adminService.getAdmins(roomId);
	};

	@Get('userId')
	getAdminsByUserId(@Req() req: Request) {
		const userId = req.header('userId');
		return this.adminService.getAdminsByUserId(userId);
	};

	@Post()
	createAdmin(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('new-admin');
		const userName = req.header('userName');
		return this.adminService.createAdmin(roomId, userId, userName);
	}

	@Delete()
	deleteAdminById(@Req() req: Request) {
		const roomId = parseInt(req.header('roomId'));
		const userId = req.header('delete-admin');
		return this.adminService.deleteAdminById(roomId, userId);
	};
}
