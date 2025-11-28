import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private readonly configService: ConfigService) {
    const hrEmail = this.configService.get<string>('HR_EMAIL');
    if (!hrEmail) throw new NotFoundException('HR email not found');

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('MAIL_USER'), // company email ....
        pass: this.configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendHrMail(subject: string, html: string) {
    await this.transporter.sendMail({
      from: `"Katlos Laptop Service" <${this.configService.get<string>('MAIL_USER')}>`,
      to: this.configService.get<string>('HR_EMAIL'),
      subject,
      html,
    });
  }
}
