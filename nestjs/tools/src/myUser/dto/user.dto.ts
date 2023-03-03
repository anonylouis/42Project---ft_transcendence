import {
	IsEmail,
	IsOptional,
	Length,
	Matches
} from 'class-validator';

export class UserDto {
	@IsOptional()
	@IsEmail()
	email: string;

	@IsOptional()
	@Matches("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}")
	password: string;

	@IsOptional()
	@Matches("[A-Za-z0-9]{3,10}")
	login: string;

	@IsOptional()
	@Length(0, 50)
	info: string;

}
