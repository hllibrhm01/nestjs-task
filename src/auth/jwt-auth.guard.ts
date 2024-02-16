import {
  ExecutionContext,
  Injectable,
  CanActivate,
  UnauthorizedException,
  Logger
} from "@nestjs/common";

import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "./public.decorator";
import { TokenService } from "../token/token.service";
import { UsersService } from "../users/users.service";
import { Request } from "express";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly userService: UsersService
  ) {}

  private logger = new Logger(JwtAuthGuard.name);

  extractTokenFromHeader(request: Request) {
    const authorization = request.headers.authorization;
    if (typeof authorization !== "string") {
      return null;
    }

    const [type, token] = authorization.split(" ");
    if (type !== "Bearer") {
      return null;
    }

    return token;
  }

  extractTokenFromQuery(request: Request) {
    const token = request.query.token;
    if (typeof token !== "string") {
      return null;
    }

    return token;
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>() as any;

    const token =
      this.extractTokenFromHeader(request) ??
      this.extractTokenFromQuery(request);

    if (token === null) {
      throw new UnauthorizedException("Invalid token type");
    }

    const decoded = await this.tokenService
      .verifyToken(token, "login")
      .catch((error) => {
        this.logger.error("Error verifying token", error);
        throw new UnauthorizedException("Invalid token");
      });

    if (typeof decoded.sub !== "string") {
      throw new UnauthorizedException("Invalid token");
    }

    const userId = decoded.sub;
    const user = await this.userService.findOne(parseInt(userId));
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    request.user = user;

    return true;
  }
}
