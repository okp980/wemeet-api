import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { SocialAuthDto } from './dto/social-auth.dto';
import { UsersService } from 'src/users/users.service';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';
import { UpdateProfileDto } from 'src/users/dto/update-profile.dto';
import { UpdateMeDto } from 'src/users/dto/update-me.dto';
import { LoginDto, RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async register({ email, password, name }: RegisterDto) {
    let user = await this.userService.findOne({ where: { email } });
    if (user) {
      throw new ForbiddenException({ message: 'User already registered' });
    }
    const hashedPassword = await this.userService.hashPassword(password);
    user = await this.userService.create({
      email,
      password: hashedPassword,
      provider: 'email',
    });
    user.$create('profile', { name });
    const token_payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(token_payload);
    return { access_token };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.userService.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException();
    }
    const correct = await this.userService.comparePassword(
      password,
      user.password,
    );
    if (!correct) {
      throw new BadRequestException();
    }
    const token_payload = { sub: user.id };
    const access_token = await this.jwtService.signAsync(token_payload);
    return { access_token };
  }

  async socialLogin(socialAuthDto: SocialAuthDto) {
    try {
      const payload = await this.verify(socialAuthDto.token);
      const email = payload.email;
      const [user, created] = await this.userService.findOrCreate(
        {
          email,
          provider: socialAuthDto.provider,
          fcmToken: socialAuthDto.fcmToken,
        },
        email,
      );
      if (created) {
        await user.$create('profile', { name: payload.name });
      }
      const token_payload = { sub: user.id };
      const access_token = await this.jwtService.signAsync(token_payload);
      return { access_token };
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
    return payload;
  }

  async getProfile(id: number) {
    return this.userService.findById(id);
  }

  async updateProfile(user: any, { name, getNotifications, bio }: UpdateMeDto) {
    const profile = await user.$get('profile');
    await profile.update({ name, getNotifications, bio });
    return profile;
  }
}
