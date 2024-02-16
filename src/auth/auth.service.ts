import { Injectable } from "@nestjs/common";
import { User } from "../users/entities/user.entity";
import moment from "moment";
import { v4 } from "uuid";
import { TokenType } from "../token/token.enum";
import { Token } from "./entities/token.entity";
import { TokenService } from "../token/token.service";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/user-register.dto";
import { UserResponseDto } from "../users/dto/user.response.dto";
import {
  AuthError,
  InvalidCredentialsError,
  UserWithEmailNotFoundError
} from "./auth.errors";
import { plainToClass } from "class-transformer";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  private readonly jwtAccessExpirationMinutes: number;
  private readonly jwtRefreshExpirationMinutes: number;
  constructor(
    @InjectRepository(Token)
    private tokenRepository: Repository<Token>,
    private tokenService: TokenService,
    private userService: UsersService,
    private config: ConfigService
  ) {
    this.jwtAccessExpirationMinutes = parseInt(
      this.config.getOrThrow<string>("JWT_ACCESS_EXPIRATION_MINUTES")
    );
    this.jwtRefreshExpirationMinutes = parseInt(
      this.config.getOrThrow<string>("JWT_REFRESH_EXPIRATION_MINUTES")
    );
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(registerDto.email);
    if (existingUser !== null) {
      throw new Error("User with this email already exists");
    }

    const user = await this.userService.create(registerDto);
    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UserWithEmailNotFoundError(
        "The username or password is incorrect"
      );
    }

    if (!(await user.isPasswordMatch(password))) {
      throw new InvalidCredentialsError(
        "The username or password is incorrect"
      );
    }

    return user;
  }

  async generateUserLogin(user: User) {
    const accessToken = await this.generateToken(
      user,
      TokenType.Access,
      moment().add(this.jwtAccessExpirationMinutes, "minutes")
    );

    const refreshToken = await this.generateToken(
      user,
      TokenType.Refresh,
      moment().add(this.jwtRefreshExpirationMinutes, "minutes")
    );

    return {
      user: plainToClass(UserResponseDto, user),
      accessToken,
      refreshToken
    };
  }

  async generateToken(
    user: User | { id: number },
    tokenType: TokenType,
    expires: moment.Moment
  ) {
    const tokenUUID = v4();

    const token = await this.tokenService.signToken(
      { sub: user.id.toString(), aud: tokenType, jti: tokenUUID },
      expires.unix()
    );

    if (tokenType !== TokenType.Access) {
      await this.saveToken(tokenUUID, user.id, expires, tokenType);
    }

    return {
      token: token,
      expires: expires.toDate()
    };
  }

  saveToken(
    tokenUUID: string,
    userId: number,
    expires: moment.Moment,
    tokenType: TokenType
  ) {
    const token = new Token();
    token.tokenUUID = tokenUUID;
    token.userId = userId;
    token.expiresAt = expires.toDate();
    token.tokenType = tokenType;

    return token.save();
  }

  async getPayload(token: string, tokenType: TokenType) {
    return this.tokenService.verifyToken(token, tokenType);
  }

  async verifyToken(token: string, tokenType: TokenType) {
    const payload = await this.getPayload(token, tokenType);

    const { jti, sub } = payload;
    const tokenCriteria = {
      tokenUUID: jti,
      tokenType,
      userId: sub,
      blacklisted: false
    } as any;
    const tokenObj = await this.tokenRepository.findOne(tokenCriteria);
    if (!tokenObj) {
      throw new AuthError("Invalid token");
    }
    return tokenObj;
  }

  async refreshUser(token: string) {
    const tokenVal = await this.verifyToken(token, TokenType.Refresh);
    tokenVal.blacklisted = true;
    await tokenVal.save();
    const user = await this.userService.findOne(tokenVal.userId);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
