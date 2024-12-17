import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { SendMail } from './mail.interface';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class MailerService {
  constructor(private readonly configService: ConfigService) {}

  mailTransort(): nodemailer.Transporter {
    const transporter: nodemailer.Transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.configService.get<string>('EMAIL'),
        pass: this.configService.get<string>('PASSWORD'),
      },
    });

    return transporter;
  }

  async sendEmailNotification(dto: SendMail): Promise<void> {
    const transport = this.mailTransort();
    const mailOptions: Mail.Options = {
      from: this.configService.get<string>('EMAIL'),
      to: this.configService.get<string>('EMAIL'),
      subject: dto.subject,
      text: dto.text,
    };

    try {
      const info: nodemailer.SentMessageInfo =
        await transport.sendMail(mailOptions);

      console.log('Email sent:', info.response);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  }
}
