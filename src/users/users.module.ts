import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    SequelizeModule.forFeature([Profile]),
    FileModule,
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
