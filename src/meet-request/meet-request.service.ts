import { Injectable, Logger, MethodNotAllowedException } from '@nestjs/common';
import { CreateMeetRequestDto } from './dto/create-meet-request.dto';
import { UpdateMeetRequestDto } from './dto/update-meet-request.dto';
import { InjectModel } from '@nestjs/sequelize';
import { MeetRequest } from './models/meet-request.model';
import { User } from 'src/users/models/user.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MeetRequestCreatedEvent } from './events/meet-request.created.event';
import { MeetRequestUpdatedEvent } from './events/meet-request.updated.event';
import { Profile } from 'src/users/models/profile.model';
import { Op } from 'sequelize';
import { GetMeetRequestDto } from './dto/get-meet-request.dto';
import { PaginatedService } from 'src/shared/paginated.service';

@Injectable()
export class MeetRequestService {
  private logger = new Logger(MeetRequestService.name);
  constructor(
    @InjectModel(MeetRequest)
    private meetRequestModel: typeof MeetRequest,
    private eventEmitter: EventEmitter2,
    private paginatedService: PaginatedService,
  ) {}

  async find(userId: number, { status, page, limit }: GetMeetRequestDto) {
    return this.paginatedService.getPaginated(
      { page, limit },
      async (startIndex: number, limit: number) => {
        return await this.meetRequestModel.findAndCountAll({
          where: { status, recipientId: userId },
          include: [{ model: User, as: 'creator', include: [Profile] }],
          limit,
          offset: startIndex,
        });
      },
    );
  }
  async findOne(id: number) {
    return await this.meetRequestModel.findByPk(id, { include: User });
  }
  async create({ recipient }: CreateMeetRequestDto, creator: number) {
    let meet = await this.meetRequestModel.findOne({
      where: { creatorId: creator, recipientId: recipient },
    });
    if (meet) {
      if (meet.status === 'rejected') {
        await meet.update({ status: 'pending' });
        await meet.save();
        this.eventEmitter.emit(
          'meet-request.created',
          new MeetRequestCreatedEvent(creator, recipient),
        );
        return meet;
      }
      throw new MethodNotAllowedException('Already sent a meet request');
    }
    meet = await this.meetRequestModel.create({
      creatorId: creator,
      recipientId: recipient,
    });
    this.eventEmitter.emit(
      'meet-request.created',
      new MeetRequestCreatedEvent(creator, recipient),
    );
    return meet;
  }

  async update(id: number, { status }: UpdateMeetRequestDto) {
    const meetRequest = await this.meetRequestModel.findByPk(id);
    await meetRequest.update({ status });
    await meetRequest.save();
    if (status === 'accepted') {
      this.eventEmitter.emit(
        'meet-request.updated',
        new MeetRequestUpdatedEvent(
          meetRequest.creatorId,
          meetRequest.recipientId,
        ),
      );
    }
    return meetRequest;
  }

  async findAllMeets(userId: number) {
    const meets = await this.meetRequestModel.findAll({
      where: {
        status: 'accepted',
        [Op.or]: [{ recipientId: userId }, { creatorId: userId }],
      },
      include: [
        { model: User, as: 'creator', include: [Profile] },
        { model: User, as: 'recipient', include: [Profile] },
      ],
    });
    const friendMeets = meets.map(async (meet) =>
      meet.creator.id === userId ? meet.recipient : meet.creator,
    );

    return friendMeets;
  }

  async findMeets(userId: number, { limit = 10, page = 1 }: GetMeetRequestDto) {
    return this.paginatedService.getPaginated(
      { page, limit },
      async (startIndex: number, limit: number) => {
        return await this.meetRequestModel.findAndCountAll({
          limit,
          offset: startIndex,
          where: {
            status: 'accepted',
            [Op.or]: [{ recipientId: userId }, { creatorId: userId }],
          },
          include: [
            { model: User, as: 'creator', include: [Profile] },
            { model: User, as: 'recipient', include: [Profile] },
          ],
        });
      },
      (rows) =>
        rows.map((row) =>
          row.creator.id === userId ? row.recipient : row.creator,
        ),
    );
  }
}
