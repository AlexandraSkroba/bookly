import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MAIL_SERVICE } from 'src/constants';
import { MailerService } from './mailer.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: MAIL_SERVICE,
      useClass: MailerService,
    },
  ],
  exports: [MAIL_SERVICE],
})
export class MailerModule {}
