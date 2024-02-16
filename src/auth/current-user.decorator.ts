import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import { Request } from "express";

interface ExtendedRequest extends Request {
  user: User;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
    return request.user as User;
  }
);
