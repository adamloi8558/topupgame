import { EASYSLIP_CONFIG, ERROR_MESSAGES } from './constants';
import { EasySlipResponse } from '@/types';

export interface EasySlipVerifyRequest {
  url: string;
  checkDuplicate?: boolean;
}

export interface EasySlipApiResponse {
  success: boolean;
  data?: {
    amount: {
      amount: number;
      currency: string;
    };
    sender: {
      account: {
        name: string;
        bank: string;
      };
    };
    receiver: {
      account: {
        name: string;
        bank: string;
      };
    };
    transactionDate: string;
    transactionId: string;
    ref1?: string;
    ref2?: string;
  };
  message?: string;
  duplicate?: boolean;
  code?: string;
}

export class EasySlipAPI {
  private baseUrl: string;
  private accessToken: string;

  constructor() {
    this.baseUrl = EASYSLIP_CONFIG.apiUrl;
    this.accessToken = EASYSLIP_CONFIG.accessToken;
  }

  async verifySlip(request: EasySlipVerifyRequest): Promise<EasySlipResponse> {
    try {
      if (!this.accessToken) {
        throw new Error('EasySlip access token is not configured');
      }

      const response = await fetch(`${this.baseUrl}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify({
          url: request.url,
          checkDuplicate: request.checkDuplicate ?? true,
        }),
      });

      const data: EasySlipApiResponse = await response.json();

      // Handle different response status codes
      if (response.status === 200 && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message,
          duplicate: data.duplicate,
        };
      }

      // Handle error cases
      if (response.status === 400) {
        return {
          success: false,
          message: this.getErrorMessage(data.code || data.message),
          duplicate: data.duplicate,
        };
      }

      if (response.status === 401) {
        return {
          success: false,
          message: ERROR_MESSAGES.UNAUTHORIZED,
        };
      }

      if (response.status >= 500) {
        return {
          success: false,
          message: ERROR_MESSAGES.SERVER_ERROR,
        };
      }

      return {
        success: false,
        message: data.message || ERROR_MESSAGES.NETWORK_ERROR,
      };

    } catch (error) {
      console.error('EasySlip API error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  private getErrorMessage(errorCode?: string): string {
    const errorMessages: Record<string, string> = {
      'duplicate_slip': ERROR_MESSAGES.DUPLICATE_SLIP,
      'invalid_image': ERROR_MESSAGES.INVALID_SLIP,
      'invalid_url': 'URL ของสลิปไม่ถูกต้อง',
      'unsupported_bank': 'ธนาคารนี้ยังไม่รองรับ',
      'unable_to_read': 'ไม่สามารถอ่านข้อมูลจากสลิปได้',
      'insufficient_balance': 'ยอดเงินในสลิปไม่เพียงพอ',
      'expired_slip': 'สลิปนี้หมดอายุแล้ว',
      'invalid_format': 'รูปแบบสลิปไม่ถูกต้อง',
      'network_error': ERROR_MESSAGES.NETWORK_ERROR,
      'server_error': ERROR_MESSAGES.SERVER_ERROR,
    };

    return errorMessages[errorCode || ''] || ERROR_MESSAGES.INVALID_SLIP;
  }

  async getSlipStatus(slipId: string): Promise<EasySlipResponse> {
    try {
      if (!this.accessToken) {
        throw new Error('EasySlip access token is not configured');
      }

      const response = await fetch(`${this.baseUrl}/status/${slipId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      const data: EasySlipApiResponse = await response.json();

      if (response.ok && data.success) {
        return {
          success: true,
          data: data.data,
          message: data.message,
          duplicate: data.duplicate,
        };
      }

      return {
        success: false,
        message: data.message || ERROR_MESSAGES.NETWORK_ERROR,
      };

    } catch (error) {
      console.error('EasySlip status check error:', error);
      return {
        success: false,
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  // Validate slip image before sending to API
  validateSlipImage(file: File): { valid: boolean; error?: string } {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: ERROR_MESSAGES.INVALID_FILE_TYPE,
      };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        valid: false,
        error: ERROR_MESSAGES.FILE_TOO_LARGE,
      };
    }

    return { valid: true };
  }

  // Helper method to convert file to base64 for API
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Validate bank account information
  validateBankAccount(
    receiverBank: string, 
    receiverName: string, 
    expectedBank: string, 
    expectedName: string
  ): boolean {
    // Normalize strings for comparison
    const normalizeString = (str: string) => 
      str.toLowerCase().replace(/\s+/g, '').trim();

    const normalizedReceiverBank = normalizeString(receiverBank);
    const normalizedExpectedBank = normalizeString(expectedBank);
    const normalizedReceiverName = normalizeString(receiverName);
    const normalizedExpectedName = normalizeString(expectedName);

    // Check if bank names match (allow partial matching)
    const bankMatches = normalizedReceiverBank.includes(normalizedExpectedBank) ||
                       normalizedExpectedBank.includes(normalizedReceiverBank);

    // Check if account names match (allow partial matching)
    const nameMatches = normalizedReceiverName.includes(normalizedExpectedName) ||
                       normalizedExpectedName.includes(normalizedReceiverName);

    return bankMatches && nameMatches;
  }

  // Process slip verification result
  processSlipResult(
    result: EasySlipResponse,
    expectedAmount: number,
    expectedBank: string,
    expectedName: string
  ): {
    valid: boolean;
    errors: string[];
    amount?: number;
    transactionId?: string;
  } {
    const errors: string[] = [];

    if (!result.success || !result.data) {
      errors.push(result.message || ERROR_MESSAGES.INVALID_SLIP);
      return { valid: false, errors };
    }

    // Check for duplicate
    if (result.duplicate) {
      errors.push(ERROR_MESSAGES.DUPLICATE_SLIP);
      return { valid: false, errors };
    }

    const { data } = result;

    // Validate amount
    if (data.amount.amount !== expectedAmount) {
      errors.push(`จำนวนเงินไม่ตรงกัน คาดหวัง ${expectedAmount} บาท แต่ได้รับ ${data.amount.amount} บาท`);
    }

    // Validate bank account
    if (!this.validateBankAccount(
      data.receiver.account.bank,
      data.receiver.account.name,
      expectedBank,
      expectedName
    )) {
      errors.push(ERROR_MESSAGES.BANK_ACCOUNT_MISMATCH);
    }

    // Check transaction date (should not be too old)
    const transactionDate = new Date(data.transactionDate);
    const now = new Date();
    const daysDiff = (now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > 7) {
      errors.push('สลิปนี้เก่าเกินไป (เกิน 7 วัน)');
    }

    if (daysDiff < 0) {
      errors.push('วันที่ในสลิปไม่ถูกต้อง');
    }

    return {
      valid: errors.length === 0,
      errors,
      amount: data.amount.amount,
      transactionId: data.transactionId,
    };
  }
}

// Export singleton instance
export const easySlipAPI = new EasySlipAPI(); 