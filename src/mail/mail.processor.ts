import { Injectable, Logger } from '@nestjs/common';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { MailInterface } from './interfaces/mail.interface';

@Processor('email')
@Injectable()
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name);
  constructor(private readonly mailService: MailerService) {}

  @Process('confirmation')
  async sendConfirmationEmail(job: Job<MailInterface>) {
    console.log('THIS IS PROCESSED');
    const { data } = job;

    await this.mailService.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'confirmation',
      context: data.context,
    });
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} has been completed`);
  }
}
