import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateMedalDto {
	@IsString()
	@IsNotEmpty()
	title: string

	@IsString()
	@IsOptional()
	description?: string
}
