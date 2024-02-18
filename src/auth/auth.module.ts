import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Profile } from 'src/users/models/profile.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forFeature([Profile]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        global: true,
        secret: configService.get('TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('EXPIRE_DURATION') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
