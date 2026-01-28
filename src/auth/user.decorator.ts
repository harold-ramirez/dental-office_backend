import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface JwtUser {
  userID: number;
  username: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
