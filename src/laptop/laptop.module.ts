import { Module } from '@nestjs/common';
import { LaptopService } from './laptop.service';
import { LaptopController } from './laptop.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { DbService } from 'src/db/db.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  providers: [LaptopService, DbService],
  imports: [CloudinaryModule, MailModule],
  controllers: [LaptopController],
})
export class LaptopModule {}
