import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Dialog } from './entities/dialog.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateDialogDto } from './dto/create-dialog.dto';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(currentUser: UserEntity) {
    const user = await this.usersRepository.findOne({
      where: { id: currentUser.id },
      relations: ['dialogs', 'dialogs.users', 'dialogs.subjects.book'],
    });
    return user.dialogs;
  }

  async findOne(id: number, userId) {
    const dialog = await this.dialogsRepository.findOne({
      where: { id, users: { id: In(userId) } },
      relations: ['subjects', 'messages', 'messages.author'],
    });
    if (!dialog) {
      throw NotFoundException;
    }

    return dialog;
  }

  async create(
    params: CreateDialogDto,
    currentUser: UserEntity,
    checkExisting: boolean = true,
    throwException: boolean = true,
  ) {
    if (checkExisting) {
      const existingDialog = await this.checkExisting(
        params,
        currentUser,
        throwException,
      );
      if (existingDialog) {
        return existingDialog;
      }
    }
    const user = this.usersRepository.findOne({ where: { id: params.userId } });

    const newDialog = this.dialogsRepository.create();
    newDialog.users = [await user, currentUser];

    return this.dialogsRepository.save(newDialog);
  }

  async findSubjects(id: number) {
    return (
      await this.dialogsRepository.findOne({
        where: { id },
        relations: ['subjects.book'],
      })
    ).subjects;
  }

  async checkExisting(
    params: CreateDialogDto,
    currentUser: UserEntity,
    throwError: boolean = true,
  ) {
    const existingDialog = await this.dialogsRepository
      .createQueryBuilder('dialog')
      .innerJoinAndSelect('dialog.users', 'user')
      .where('user.id IN (:...userIds)', {
        userIds: [params.userId, currentUser.id],
      })
      .groupBy('dialog.id, user.id')
      .having('COUNT(dialog.id) = :count', { count: 2 })
      .getOne();
    if (throwError && existingDialog) {
      throw new ConflictException('Dialog already exists');
    }

    return existingDialog;
  }

  async addUser(userId: number, socketId: string) {
    return await this.usersRepository.update(userId, {
      messagesSocketId: socketId,
    });
  }

  async removeSubject(dialog: Dialog, subject: ExchangeEntity) {
    if (!dialog.subjects) {
      dialog = await this.dialogsRepository.findOne({
        where: { id: dialog.id },
        relations: ['subjects'],
      });
    }

    dialog.subjects = [...dialog.subjects].filter(
      (subj) => subj.id !== subject.id,
    );
    return await this.dialogsRepository.save(dialog);
  }
}
