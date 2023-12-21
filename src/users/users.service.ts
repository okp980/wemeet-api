import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Express } from 'express';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';
import { CreateUserDto } from './dto/create-user.dto';
import { FileService } from 'src/file/file.service';

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

    const key = `${updateProfile.firstName}-${updateProfile.lastName}-${id}`;
    const buffer = await this.fileService.compressImage(file.buffer, 800);
    await this.fileService.delete(key);
    const image = await this.fileService.upload({ ...file, buffer }, key);
    const profile = await this.profileModel.findOne({ where: { userId: id } });
    profile.update({ ...updateProfile, image });
    await profile.save();
    return profile;
  }
}
