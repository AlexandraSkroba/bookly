import { Address } from 'nodemailer/lib/mailer';

export interface SendMail {
  from?: Address;
  to: string;
  subject: string;
  text: string;
}
