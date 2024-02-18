import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PaginatedQueryDto } from 'src/shared/dto/paginated.dto';
import { PaginatedService } from 'src/shared/paginated.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Profile)
    private profileModel: typeof Profile,
    private fileService: FileService,
    private paginatedService: PaginatedService,
  ) {}
  async create(createUserDto: any) {
    return this.userModel.create(createUserDto);
  }
  async findAll(
    { limit = 10, page = 1 }: PaginatedQueryDto,
    id: number,
  ): Promise<any> {
    return this.paginatedService.getPaginated(
      { page, limit },
      async (startIndex: number, limit: number) => {
        return await this.userModel.findAndCountAll({
          limit,
          offset: startIndex,
          include: Profile,
          where: { id: { [Op.ne]: id } },
          attributes: { exclude: ['password', 'socketId', 'fcmToken'] },
        });
      },
    );
  }
  async findOrCreate(
    createUserDto: any,
    email: string,
  ): Promise<[User, boolean]> {
    return this.userModel.findOrCreate({
      where: { email },
      defaults: createUserDto,
      include: Profile,
    });
  }

  async findById(id: number) {
    const user = await this.userModel.findByPk(id, {
      include: Profile,
      attributes: { exclude: ['password', 'socketId', 'fcmToken'] },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async findOne(arg: any) {
    const user = await this.userModel.findOne(arg);
    if (!user) throw new NotFoundException();
    return user;
  }

  // async createUser(createUserDto: any) {
  //   return await this.userModel.create(createUserDto);
  // }

  async updateUserProfile(
    id: number,
    updateProfile: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();

    if (file) {
      const key = uuidv4();
      const buffer = await this.fileService.compressImage(file.buffer, 800);
      if (user.profile.image) {
        await this.fileService.delete(user.profile.image);
      }
      const image = await this.fileService.upload({ ...file, buffer }, key);
      const profile = await this.profileModel.findOne({
        where: { userId: id },
      });
      profile.update({ ...updateProfile, image });
      await profile.save();
      return profile;
    }
    const profile = await this.profileModel.findOne({
      where: { userId: id },
    });

    profile.update(updateProfile);
    await profile.save();
    return profile;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  async comparePassword(
    password: string,
    hashedPassord: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassord);
  }

  async clearSocketId(id: number) {
    const user = await this.findById(id);
    user.socketId = null;
    return await user.save();
  }
}
