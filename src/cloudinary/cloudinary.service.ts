import { Injectable } from '@nestjs/common';
import { CloudinaryConfig } from './cloudinary.config';
import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  private cloudinary: typeof cloudinary;

  constructor(private cloudinaryConfig: CloudinaryConfig) {
    this.cloudinary = this.cloudinaryConfig.getInstance();
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = 'katlos',
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader
        .upload_stream({ folder }, (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve(result);
          } else {
            reject(new Error('Upload failed: No result returned'));
          }
        })
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    return this.cloudinary.uploader.destroy(publicId);
  }
}
