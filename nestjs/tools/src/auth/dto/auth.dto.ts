import {
	IsEmail,
	IsOptional,
	IsNotEmpty,
	Length,
	Matches
} from 'class-validator';

export class AuthDto {
	@IsNotEmpty()
	email: string;

	@Matches("(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{5,}")
	password: string;

	@Matches("[A-Za-z0-9]{3,10}")
	login: string;

	@IsOptional()
	@Length(0, 50)
	info: string;

}
