import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { CLOUDFLARE_R2_CONFIG } from './constants';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export class CloudflareR2 {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = CLOUDFLARE_R2_CONFIG.bucketName;
    this.publicUrl = CLOUDFLARE_R2_CONFIG.publicUrl;

    // Validate required configuration
    if (!CLOUDFLARE_R2_CONFIG.accessKeyId || !CLOUDFLARE_R2_CONFIG.secretAccessKey || !CLOUDFLARE_R2_CONFIG.endpoint) {
      console.error('Missing required R2 configuration');
      throw new Error('R2 configuration is incomplete');
    }

    // Initialize S3 client with Cloudflare R2 credentials
    this.client = new S3Client({
      region: 'auto',
      endpoint: CLOUDFLARE_R2_CONFIG.endpoint,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_CONFIG.accessKeyId,
        secretAccessKey: CLOUDFLARE_R2_CONFIG.secretAccessKey,
      },
    });
  }

  private validateFile(file: File): { valid: boolean; error?: string } {
    if (!file) {
      return { valid: false, error: 'ไม่พบไฟล์' };
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { valid: false, error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)' };
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'ประเภทไฟล์ไม่ถูกต้อง (รองรับ JPG, PNG, WEBP)' };
    }

    return { valid: true };
  }

  private generateFileKey(fileName: string, folder: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop();
    return `${folder}/${timestamp}-${randomString}.${extension}`;
  }

  // Upload file to R2
  async uploadFile(
    file: File, 
    folder: string = 'uploads',
    options: {
      makePublic?: boolean;
      metadata?: Record<string, string>;
    } = {}
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error,
        };
      }

      // Generate unique key
      const key = this.generateFileKey(file.name, folder);

      // Convert file to buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Prepare upload command
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        ContentLength: file.size,
        Metadata: {
          originalName: file.name,
          uploadedAt: new Date().toISOString(),
          ...options.metadata,
        },
      });

      // Upload file
      await this.client.send(uploadCommand);

      // Generate public URL
      const url = `${this.publicUrl}/${key}`;

      return {
        success: true,
        url,
        key,
      };

    } catch (error) {
      console.error('R2 upload error:', error);
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      };
    }
  }

  // Delete file from R2
  async deleteFile(key: string): Promise<boolean> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(deleteCommand);
      return true;
    } catch (error) {
      console.error('R2 delete error:', error);
      return false;
    }
  }
}

// Export singleton instance
export const cloudflareR2 = new CloudflareR2(); 