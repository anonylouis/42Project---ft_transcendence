import { AuthGuard } from '@nestjs/passport';

export class JwtGuard extends AuthGuard('jwt-any-name') {
	constructor() {
		super();
	}
}
