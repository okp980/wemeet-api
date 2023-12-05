import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SocialAuthDto } from './dto/social-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(private userService: UsersService) {}
  async socialLogin(socialAuthDto: SocialAuthDto) {
    try {
      const payload = await this.verify(socialAuthDto.token);
      const name = payload.name.split(',');
      const email = payload.email;
      const [user, created] = await this.userService.findOrCreate(
        {
          firstName: name[0],
          lastName: name[1],
          email,
          provider: socialAuthDto.provider,
        },
        email,
      );
      return user;
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException();
    }
  }

  async verify(token: string) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: [
        '445986193855-bcb87d7m354vgd03h59a942umt8m4c19.apps.googleusercontent.com',
        '445986193855-kvt8luph79s3esfut87ati153nilqdtg.apps.googleusercontent.com',
      ],
    });
    const payload = ticket.getPayload();
    this.logger.log('payload', payload);
    return payload;
  }
}
