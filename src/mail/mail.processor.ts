import { Injectable, Logger } from '@nestjs/common';
import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
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
    const { data } = job;

    await this.mailService.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'confirmation',
      context: data.context,
    });
  }

  @Process('reset-password')
  async sendPasswordResetEmail(job: Job<MailInterface>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'reset-password',
      context: data.context,
    });
  }

  @Process('notification')
  async notify(job: Job<MailInterface>) {
    const { data } = job;

    await this.mailService.sendMail({
      to: data.to,
      subject: data.subject,
      template: 'reset-password',
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

  @OnQueueFailed()
  onError(job: Job, error: Error) {
    this.logger.log(`Job ${job.id} failed. Error: ${error}`);
  }
}
