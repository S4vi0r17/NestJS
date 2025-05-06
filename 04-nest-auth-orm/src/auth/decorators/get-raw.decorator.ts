import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RawHeaders = createParamDecorator(
  (data: keyof Request['headers'] | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const headers = request.headers;
    return data ? headers[data] : headers;
  },
);
