'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useUIStore } from '@/stores/ui-store';
import { useAuthStore } from '@/stores/auth-store';
import { FILE_UPLOAD } from '@/lib/constants';
import { ApiResponse } from '@/types';
import { Upload, FileImage, CheckCircle, AlertCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlipUploadProps {
  orderId: string;
  onUploadSuccess?: () => void;
}

export function SlipUpload({ orderId, onUploadSuccess }: SlipUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const { addToast } = useUIStore();
  const { updatePoints } = useAuthStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file
      if (file.size > FILE_UPLOAD.MAX_SIZE) {
        addToast({
          type: 'error',
          title: 'ไฟล์ใหญ่เกินไป',
          message: `ขนาดไฟล์ต้องไม่เกิน ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024} MB`,
        });
        return;
      }

      if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
        addToast({
          type: 'error',
          title: 'ประเภทไฟล์ไม่ถูกต้อง',
          message: 'กรุณาเลือกไฟล์ภาพ (JPG, PNG, WEBP)',
        });
        return;
      }

      setUploadedFile(file);
      
      // Create preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, [addToast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    disabled: isUploading || uploadSuccess,
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('orderId', orderId);

      const response = await fetch('/api/slips/upload', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        setUploadSuccess(true);
        addToast({
          type: 'success',
          title: 'อัปโหลดสลิปสำเร็จ',
          message: 'กำลังตรวจสอบสลิปอัตโนมัติ...',
        });

        // Auto verify slip
        await handleVerifySlip(result.data.slipId);
      } else {
        addToast({
          type: 'error',
          title: 'อัปโหลดไม่สำเร็จ',
          message: result.error || 'เกิดข้อผิดพลาดในการอัปโหลด',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถอัปโหลดไฟล์ได้',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleVerifySlip = async (slipId: string) => {
    try {
      setIsVerifying(true);

      const response = await fetch('/api/slips/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slipId }),
      });

      const result: ApiResponse = await response.json();

      if (result.success) {
        addToast({
          type: 'success',
          title: 'เติมพ้อยสำเร็จ! 🎉',
          message: result.message || 'พ้อยถูกเติมเข้าบัญชีแล้ว',
          duration: 8000,
        });

        // Update user points
        if (result.data?.newPoints) {
          updatePoints(result.data.newPoints);
        }

        onUploadSuccess?.();
      } else {
        addToast({
          type: 'error',
          title: 'ตรวจสอบสลิปไม่สำเร็จ',
          message: result.error || 'กรุณาติดต่อแอดมิน',
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      addToast({
        type: 'error',
        title: 'เกิดข้อผิดพลาด',
        message: 'ไม่สามารถตรวจสอบสลิปได้',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClear = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          onDrop([file]);
        }
        break;
      }
    }
  };

  return (
    <Card gaming>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>อัปโหลดสลิปการโอนเงิน</span>
        </CardTitle>
        <CardDescription>
          อัปโหลดสลิปการโอนเงินเพื่อยืนยันการชำระ
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            onPaste={handlePaste}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive
                ? 'border-neon-green bg-neon-green/10'
                : 'border-border hover:border-neon-green/50 hover:bg-neon-green/5'
            )}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <Upload className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? 'วางไฟล์ที่นี่...' : 'ลากไฟล์มาวาง หรือคลิกเพื่อเลือก'}
                </p>
                <p className="text-sm text-muted-foreground">
                  รองรับไฟล์ภาพ JPG, PNG, WEBP (สูงสุด {FILE_UPLOAD.MAX_SIZE / 1024 / 1024} MB)
                </p>
                <p className="text-xs text-muted-foreground">
                  💡 เคล็ดลับ: คุณสามารถ Ctrl+V วางภาพจาก clipboard ได้
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Preview */}
            <div className="relative">
              <div className="relative aspect-[3/4] max-w-sm mx-auto rounded-lg overflow-hidden border border-border">
                {previewUrl && (
                  <Image
                    src={previewUrl}
                    alt="สลิปการโอนเงิน"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              {!uploadSuccess && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={handleClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* File Info */}
            <div className="flex items-center space-x-3 p-3 bg-gaming-darker/50 rounded-lg">
              <FileImage className="h-8 w-8 text-neon-blue" />
              <div className="flex-1">
                <div className="font-medium">{uploadedFile.name}</div>
                <div className="text-sm text-muted-foreground">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              {uploadSuccess ? (
                <CheckCircle className="h-6 w-6 text-neon-green" />
              ) : (
                <AlertCircle className="h-6 w-6 text-yellow-500" />
              )}
            </div>

            {/* Action Button */}
            {!uploadSuccess && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                variant="gaming"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <LoadingSpinner size="sm" color="white" className="mr-2" />
                    กำลังอัปโหลด...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    อัปโหลดสลิป
                  </>
                )}
              </Button>
            )}

            {/* Verification Status */}
            {uploadSuccess && (
              <div className="text-center space-y-2">
                {isVerifying ? (
                  <div className="flex items-center justify-center space-x-2 text-neon-blue">
                    <LoadingSpinner size="sm" color="neon" />
                    <span>กำลังตรวจสอบสลิปอัตโนมัติ...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2 text-neon-green">
                    <CheckCircle className="h-5 w-5" />
                    <span>อัปโหลดสำเร็จ รอผลการตรวจสอบ</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 