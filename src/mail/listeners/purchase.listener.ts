import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from '../mail.service';
import { Injectable } from '@nestjs/common';
import { purchaseInterestTemplate } from '../templates/purchase-interest.template';

@Injectable()
export class PurchaseListner {
  constructor(private mailService: MailService) {}

  @OnEvent('purchase.interested')
  async handlePurchaseInterest(payload: any) {
    const html = purchaseInterestTemplate(payload);

    await this.mailService.sendHrMail(
      `User Intrest in ${payload.laptopId}`,
      html,
    );
  }
}
