import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Dialog } from './entities/dialog.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { ExchangeEntity } from 'src/exchanges/entities/exchange.entity';
import { CreateDialogDto } from './dto/create-dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(ExchangeEntity)
    private readonly exchangesRepository: Repository<ExchangeEntity>,
  ) {}

  async findOne(id: number, userId) {
    const dialog = await this.dialogsRepository.findOne({
      where: { id, users: { id: In(userId) } },
      relations: ['subject', 'messages'],
    });
    if (!dialog) {
      throw NotFoundException;
    }

    return dialog;
  }

  async create(params: CreateDialogDto, currentUser: UserEntity) {
    const existingDialog = this.dialogsRepository.findOne({
      where: {
        users: { id: In([params.userId, currentUser.id]) },
        subject: { id: params.subjectId },
      },
    });
    if (!existingDialog) {
      throw new ConflictException('Dialog already exists');
    }

    const user = this.usersRepository.findOne({ where: { id: params.userId } });

    const newDialog = this.dialogsRepository.create();
    if (params.subjectId) {
      const exchange = this.exchangesRepository.findOne({
        where: { id: params.subjectId },
      });
      newDialog.subject = await exchange;
    }

    newDialog.users = [await user, currentUser];

    return this.dialogsRepository.save(newDialog);
  }
}
