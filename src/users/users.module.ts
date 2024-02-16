import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { FileModule } from 'src/file/file.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Profile]),
    SharedModule,
    FileModule,
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
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService, JwtModule],
})
export class UsersModule {}
