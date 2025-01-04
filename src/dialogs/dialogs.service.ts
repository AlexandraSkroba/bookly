import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Dialog } from './entities/dialog.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { CreateDialogDto } from './dto/create-dialog.dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(Dialog)
    private readonly dialogsRepository: Repository<Dialog>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
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

  async create(
    params: CreateDialogDto,
    currentUser: UserEntity,
    checkExisting: boolean = true,
  ) {
    if (checkExisting) {
      this.checkExisting(params, currentUser);
    }
    const user = this.usersRepository.findOne({ where: { id: params.userId } });

    const newDialog = this.dialogsRepository.create();
    newDialog.users = [await user, currentUser];

    return this.dialogsRepository.save(newDialog);
  }

  async checkExisting(
    params: CreateDialogDto,
    currentUser: UserEntity,
    throwError: boolean = true,
  ) {
    const existingDialog = await this.dialogsRepository.findOne({
      where: {
        users: { id: In([params.userId, currentUser.id]) },
      },
    });
    if (throwError && existingDialog) {
      throw new ConflictException('Dialog already exists');
    }

    return existingDialog;
  }
}
