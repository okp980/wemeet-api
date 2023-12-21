import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private readonly region = this.configService.get('AWS_REGION');
  private readonly bucketName = this.configService.get('S3_BUCKET_NAME');
  private readonly secretAccessKey = this.configService.get(
    'AWS_SECRET_ACCESS_KEY',
  );
  private readonly accessKeyId = this.configService.get('AWS_ACCESS_KEY');
  private readonly client = new S3Client({
    region: this.region,
    credentials: {
      accessKeyId: this.accessKeyId,
      secretAccessKey: this.secretAccessKey,
    },
  });

  constructor(private configService: ConfigService) {}
  async upload(file: any, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    const res = await this.client.send(command);
    console.log(res, 'from aws');

    return key;
  }
  async delete(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.client.send(command);
  }
  compressImage(image: Buffer, size: number) {
    const builder = sharp(image);
    builder.resize(size);
    builder.png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      force: true,
      quality: 80,
    });
    return builder.toBuffer();
  }
}
