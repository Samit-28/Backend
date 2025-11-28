import { Injectable } from '@nestjs/common';
import {
  MulterOptionsFactory,
  MulterModuleOptions,
} from '@nestjs/platform-express';
import * as multer from 'multer';

@Injectable()
export class CloudinaryMulterConfig implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: multer.memoryStorage(), // store kndo file khy memeory main
      limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB tain hundi file size
    };
  }
}
