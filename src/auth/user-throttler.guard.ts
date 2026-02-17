import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected async getTracker(req: Record<string, any>): Promise<string> {
    const userId = req.user?.userID ?? req.user?.id ?? req.user?.sub;
    if (userId) {
      return `user:${userId}`;
    }
    return req.ip;
  }
}