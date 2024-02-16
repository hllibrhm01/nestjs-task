import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseFilters,
  HttpException,
  HttpStatus,
  HttpCode
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { RegisterDto } from "./dto/user-register.dto";
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { AuthErrorFilter } from "./auth.filter";
import { UserResponseDto } from "../users/dto/user.response.dto";
import { LoginDto } from "./dto/login.dto";
import { TokenType } from "../token/token.enum";
import moment from "moment";
import {
  UserLoginResponseDto,
  UserRefreshTokenResponseDto
} from "./dto/user-login.response.dto";
import { CurrentUser } from "./current-user.decorator";
import { User } from "../users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@ApiTags("auth")
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new AuthErrorFilter())
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@Controller("auth")
export class AuthController {
  private readonly jwtAccessExpirationMinutes: number;
  private readonly jwtRefreshExpirationMinutes: number;
  constructor(
    private readonly authService: AuthService,
    private config: ConfigService
  ) {
    this.jwtAccessExpirationMinutes = parseInt(
      this.config.getOrThrow<string>("JWT_ACCESS_EXPIRATION_MINUTES")
    );
    this.jwtRefreshExpirationMinutes = parseInt(
      this.config.getOrThrow<string>("JWT_REFRESH_EXPIRATION_MINUTES")
    );
  }

  @Public()
  @ApiCreatedResponse({ type: UserResponseDto })
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    try {
      const user = await this.authService.register(body);
      const response = new UserResponseDto();
      response.name = user.name;
      response.lastname = user.lastname;
      response.email = user.email;
      return response;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Public()
  @Post("login")
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body.email, body.password);

    const userResponse = await this.authService.generateUserLogin(user);

    const response = new UserLoginResponseDto();
    response.user = user;
    response.accessToken = userResponse.accessToken;
    response.refreshToken = userResponse.refreshToken;
    return response;
  }

  @Public()
  @Post("refresh")
  async refresh(@Body("token") token: string) {
    const user = await this.authService.refreshUser(token);
    let userParse = null;

    if (typeof user === "string") {
      userParse = JSON.parse(user);
    }

    const accessToken = await this.authService.generateToken(
      userParse,
      TokenType.Access,
      moment().add(this.jwtAccessExpirationMinutes, "minutes")
    );

    const refreshToken = await this.authService.generateToken(
      userParse,
      TokenType.Refresh,
      moment().add(this.jwtRefreshExpirationMinutes, "minutes")
    );

    const response = new UserRefreshTokenResponseDto();
    response.accessToken = accessToken;
    response.refreshToken = refreshToken;

    return response;
  }

  @ApiBearerAuth()
  @Get("me")
  async me(@CurrentUser() user: User) {
    const response = new UserResponseDto();
    response.name = user.name;
    response.lastname = user.lastname;
    response.email = user.email;
    response.role = user.role;
    return response;
  }
}
