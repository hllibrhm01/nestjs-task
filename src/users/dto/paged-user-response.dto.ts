import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./user.response.dto";
import { ValidateNested } from "class-validator";

export class PagedUserResponseDto {
  @ApiProperty({
    description: "The list of users",
    type: UserResponseDto
  })
  @Type(() => UserResponseDto)
  @Expose()
  @ValidateNested({ each: true })
  result: UserResponseDto[];

  @ApiProperty({
    description: "The total number of users",
    type: Number,
    example: 10
  })
  @Expose()
  count: number;

  @ApiProperty({
    description: "The current page",
    type: Number,
    example: 1
  })
  @Expose()
  page: number;

  @ApiProperty({
    description: "The number of users per page",
    type: Number,
    example: 10
  })
  @Expose()
  limit: number;
}
