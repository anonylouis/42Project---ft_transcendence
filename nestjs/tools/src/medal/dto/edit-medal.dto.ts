import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditMedalDto {
	@IsString()
	@IsOptional()
	title?: string

	@IsString()
	@IsOptional()
	description?: string
}
