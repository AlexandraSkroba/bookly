import { Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'

@Injectable()
export class MailerService {
    private transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    })

    async sendEmail(to: string, subject: string, text: string) {
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        })
    }
}
