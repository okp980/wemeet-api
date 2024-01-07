import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';
import { GetUsersDto } from './dto/get-users.dto';
import { Op } from 'sequelize';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Profile)
    private profileModel: typeof Profile,
    private fileService: FileService,
  ) {}
  async create(createUserDto: any) {
    return this.userModel.create(createUserDto);
  }
  async findAll({ limit = 10, page = 1 }: GetUsersDto, id: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const { count, rows } = await this.userModel.findAndCountAll({
      limit,
      offset: startIndex,
      include: Profile,
      where: { id: { [Op.ne]: id } },
    });

    const remains = Math.max(count - endIndex, 0);
    const before = Math.max(page - 1, 0);
    const totalPages = Math.ceil(count / limit);

    return {
      total: count,
      currentPage: page,
      nextPage: remains >= 1 ? page + 1 : null,
      previousPage: before >= 1 ? page - 1 : null,
      totalPages,
      data: rows,
    };
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
    return this.userModel.findByPk(id, { include: Profile });
  }

  async findOne(arg: any) {
    return this.userModel.findOne(arg);
  }

  async createUser(createUserDto: any) {
    return await this.userModel.create(createUserDto);
  }

  async createUserProfile(
    id: number,
    userProfile: { firstName: string; lastName: string },
  ) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();
    const profile = await this.profileModel.create({
      ...userProfile,
      userId: id,
    });

    return profile;
  }

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
}
