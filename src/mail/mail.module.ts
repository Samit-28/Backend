import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { PurchaseListner } from './listeners/purchase.listener';

@Module({
  providers: [MailService, PurchaseListner],
  exports: [MailService],
})
export class MailModule {}
