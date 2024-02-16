import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { UserResponseDto } from "../../users/dto/user.response.dto";

export class UserAccessTokenDto {
  @Expose()
  @ApiProperty({
    description: "The access token",
    type: String
  })
  token: string;

  @Expose()
  @ApiProperty({
    description: "The expiration time of the access token",
    type: Date
  })
  expires: Date;
}

export class UserRefreshTokenDto {
  @Expose()
  @ApiProperty({
    description: "The refresh token",
    type: String
  })
  token: string;

  @Expose()
  @ApiProperty({
    description: "The expiration date of the refresh token",
    type: Date
  })
  expires: Date;
}

export class UserLoginResponseDto {
  @Expose()
  @ApiProperty({
    description: "The user who logged in",
    type: UserResponseDto
  })
  @Type(() => UserResponseDto)
  @ValidateNested()
  user: UserResponseDto;

  @Expose()
  @ApiProperty({
    description: "The access token",
    type: UserAccessTokenDto
  })
  @Type(() => UserAccessTokenDto)
  accessToken: UserAccessTokenDto;

  @Expose()
  @ApiProperty({
    description: "The refresh token",
    type: UserRefreshTokenDto
  })
  @Type(() => UserRefreshTokenDto)
  refreshToken: UserRefreshTokenDto;
}

export class UserRefreshTokenResponseDto {
  @Expose()
  @ApiProperty({
    description: "The access token",
    type: UserAccessTokenDto
  })
  @Type(() => UserAccessTokenDto)
  accessToken: UserAccessTokenDto;

  @Expose()
  @ApiProperty({
    description: "The refresh token",
    type: UserRefreshTokenDto
  })
  @Type(() => UserRefreshTokenDto)
  refreshToken: UserRefreshTokenDto;
}
