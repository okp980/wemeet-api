import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { CreateMeetRequestDto } from './dto/create-meet-request.dto';
import { UpdateMeetRequestDto } from './dto/update-meet-request.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Meet } from './models/meet.model';
import { User } from 'src/users/models/user.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MeetRequestCreatedEvent } from './events/meet-request.created.event';
import { MeetRequestUpdatedEvent } from './events/meet-request.updated.event';
import { Profile } from 'src/users/models/profile.model';

@Injectable()
export class MeetRequestService {
  constructor(
    @InjectModel(Meet)
    private meetModel: typeof Meet,
    private eventEmitter: EventEmitter2,
  ) {}

  async find(userId: number, { status }) {
    return await this.meetModel.findAll({
      where: { status, recipientId: userId },
      include: [{ model: User, as: 'creator', include: [Profile] }],
    });
  }
  async findOne(id: number) {
    return await this.meetModel.findByPk(id, { include: User });
  }
  async create({ recipient }: CreateMeetRequestDto, creator: number) {
    let meet = await this.meetModel.findOne({
      where: { creatorId: creator, recipientId: recipient },
    });
    if (meet) {
      if (meet.status === 'rejected') {
        await meet.update({ status: 'pending' });
        await meet.save();
        this.eventEmitter.emit(
          'meet.created',
          new MeetRequestCreatedEvent(creator, recipient),
        );
        return meet;
      }
      throw new MethodNotAllowedException('Already sent a meet request');
    }
    meet = await this.meetModel.create({
      creatorId: creator,
      recipientId: recipient,
    });
    this.eventEmitter.emit(
      'meet.created',
      new MeetRequestCreatedEvent(creator, recipient),
    );
    return meet;
  }

  async update(id: number, { status }: UpdateMeetRequestDto) {
    const meet = await this.meetModel.findByPk(id);
    await meet.update({ status });
    await meet.save();
    if (status === 'accepted') {
      this.eventEmitter.emit(
        'meet.updated',
        new MeetRequestUpdatedEvent(meet.creatorId, meet.recipientId),
      );
    }
    return meet;
  }
}
