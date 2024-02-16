import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import { UserQueryOrderBy, UserQueryOrderDirection } from "../users.enum";

export class QueryUserDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: UserQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(UserQueryOrderBy)
  @IsOptional()
  orderBy?: UserQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: UserQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(UserQueryOrderDirection)
  @IsOptional()
  orderDirection?: UserQueryOrderDirection;

  @ApiProperty({
    description: "The user's id",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "The user's name",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    description: "The user's lastname",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  lastname: string;

  @ApiProperty({
    description: "The user's email",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    description: "The user's role",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  role: string;

  @ApiProperty({
    description: "The user's status",
    required: false,
    type: String
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: "Page number",
    type: "number",
    example: 1,
    default: 1,
    required: false
  })
  @Transform(({ obj, key }) => {
    return obj[key] ? parseInt(obj[key], 10) : 1;
  })
  @IsNumber()
  @Min(1)
  page: number;

  @ApiProperty({
    description: "The number of items per page",
    type: "number",
    example: 10,
    default: 10,
    required: false
  })
  @Transform(({ obj, key }) => {
    return obj[key] ? parseInt(obj[key], 10) : 10;
  })
  @IsNumber()
  @Min(1)
  @Max(50)
  limit: number;
}
