import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { CLOUDFLARE_R2_CONFIG, MAX_FILE_SIZE, ALLOWED_IMAGE_TYPES } from './constants';
import { generateId } from './utils';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

export interface FileMetadata {
  key: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

export class CloudflareR2 {
  private client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  constructor() {
    this.bucketName = CLOUDFLARE_R2_CONFIG.bucketName;
    this.publicUrl = CLOUDFLARE_R2_CONFIG.publicUrl;

    // Initialize S3 client with Cloudflare R2 credentials
    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${CLOUDFLARE_R2_CONFIG.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: CLOUDFLARE_R2_CONFIG.accessKeyId,
        secretAccessKey: CLOUDFLARE_R2_CONFIG.secretAccessKey,
      },
    });
  }

  // Validate file before upload
  validateFile(file: File, maxSize: number = MAX_FILE_SIZE): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${Math.round(maxSize / 1024 / 1024)}MB)`,
      };
    }

    // Check file type for images
    if (ALLOWED_IMAGE_TYPES.length > 0 && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: 'ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPG, PNG, WEBP',
      };
    }

    return { valid: true };
  }

  // Generate unique file key
  generateFileKey(originalName: string, folder: string = ''): string {
    const timestamp = Date.now();
    const randomId = generateId();
    const extension = originalName.split('.').pop() || '';
    const baseName = originalName.split('.').slice(0, -1).join('.').replace(/[^a-zA-Z0-9]/g, '-');
    
    const fileName = `${baseName}-${timestamp}-${randomId}.${extension}`;
    return folder ? `${folder}/${fileName}` : fileName;
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
      const buffer = new Uint8Array(arrayBuffer);

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

  // Upload base64 image
  async uploadBase64Image(
    base64Data: string,
    fileName: string,
    folder: string = 'uploads'
  ): Promise<UploadResult> {
    try {
      // Parse base64 data
      const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return {
          success: false,
          error: 'รูปแบบ Base64 ไม่ถูกต้อง',
        };
      }

      const contentType = matches[1];
      const base64Content = matches[2];

      // Validate content type
      if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
        return {
          success: false,
          error: 'ประเภทไฟล์ไม่ถูกต้อง รองรับเฉพาะ JPG, PNG, WEBP',
        };
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(base64Content, 'base64');

      // Check file size
      if (buffer.length > MAX_FILE_SIZE) {
        return {
          success: false,
          error: `ไฟล์มีขนาดใหญ่เกินไป (สูงสุด ${Math.round(MAX_FILE_SIZE / 1024 / 1024)}MB)`,
        };
      }

      // Generate unique key
      const key = this.generateFileKey(fileName, folder);

      // Upload to R2
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.length,
        Metadata: {
          originalName: fileName,
          uploadedAt: new Date().toISOString(),
          source: 'base64',
        },
      });

      await this.client.send(uploadCommand);

      // Generate public URL
      const url = `${this.publicUrl}/${key}`;

      return {
        success: true,
        url,
        key,
      };

    } catch (error) {
      console.error('R2 base64 upload error:', error);
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์',
      };
    }
  }

  // Delete file from R2
  async deleteFile(key: string): Promise<{ success: boolean; error?: string }> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.client.send(deleteCommand);

      return { success: true };

    } catch (error) {
      console.error('R2 delete error:', error);
      return {
        success: false,
        error: 'เกิดข้อผิดพลาดในการลบไฟล์',
      };
    }
  }

  // Get file info (metadata)
  async getFileInfo(key: string): Promise<FileMetadata | null> {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const response = await this.client.send(getCommand);

      if (!response.Metadata) {
        return null;
      }

      return {
        key,
        url: `${this.publicUrl}/${key}`,
        size: response.ContentLength || 0,
        type: response.ContentType || '',
        uploadedAt: new Date(response.Metadata.uploadedAt || response.LastModified || new Date()),
      };

    } catch (error) {
      console.error('R2 get file info error:', error);
      return null;
    }
  }

  // Extract file key from URL
  extractKeyFromUrl(url: string): string | null {
    try {
      const publicUrlBase = this.publicUrl.replace(/\/$/, '');
      if (url.startsWith(publicUrlBase)) {
        return url.replace(publicUrlBase + '/', '');
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(
    files: File[],
    folder: string = 'uploads'
  ): Promise<UploadResult[]> {
    const results = await Promise.all(
      files.map(file => this.uploadFile(file, folder))
    );
    return results;
  }

  // Helper method to handle slip uploads specifically
  async uploadSlip(file: File, orderId: string): Promise<UploadResult> {
    return this.uploadFile(file, `slips/${orderId}`, {
      metadata: {
        orderId,
        type: 'payment-slip',
      },
    });
  }

  // Helper method to handle product image uploads
  async uploadProductImage(file: File, productId: string): Promise<UploadResult> {
    return this.uploadFile(file, `products/${productId}`, {
      metadata: {
        productId,
        type: 'product-image',
      },
    });
  }

  // Helper method to handle game logo uploads
  async uploadGameLogo(file: File, gameId: string): Promise<UploadResult> {
    return this.uploadFile(file, `games/${gameId}`, {
      metadata: {
        gameId,
        type: 'game-logo',
      },
    });
  }

  // Cleanup old files (utility method for maintenance)
  async cleanupOldFiles(olderThanDays: number = 30): Promise<void> {
    // This would require listing objects and checking their dates
    // Implementation would depend on specific cleanup requirements
    console.log(`Cleanup of files older than ${olderThanDays} days would be implemented here`);
  }
}

// Export singleton instance
export const cloudflareR2 = new CloudflareR2(); 