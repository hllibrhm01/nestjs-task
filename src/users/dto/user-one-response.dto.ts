import { Expose, Type } from "class-transformer";
import { UserResponseDto } from "./user.response.dto";

export class UserOneResponseDto {
  @Expose()
  @Type(() => UserResponseDto)
  result: UserResponseDto;
}
