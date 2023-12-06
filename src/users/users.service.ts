import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Profile } from './models/profile.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Profile)
    private profileModel: typeof Profile,
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
    return this.userModel.findByPk(id);
  }

  async createUserProfile(
    id: number,
    userProfile: { firstname: string; lastName: string },
  ) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();
    const profile = await this.profileModel.create({
      ...userProfile,
      userId: id,
    });

    return profile;
  }
  async updateUserProfile(id: number, updateProfile: UpdateProfileDto) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException();
    const profile = await this.profileModel.findOne({ where: { userId: id } });
    profile.update(updateProfile);
    await profile.save();
    return profile;
  }
}
