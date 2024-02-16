import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from "class-validator";
import {
  BookStoreQueryOrderBy,
  BookStoreQueryOrderDirection
} from "../bookstores.enum";

export class QueryBookstoreDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: BookStoreQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(BookStoreQueryOrderBy)
  @IsOptional()
  orderBy?: BookStoreQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: BookStoreQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(BookStoreQueryOrderDirection)
  @IsOptional()
  orderDirection?: BookStoreQueryOrderDirection;

  @ApiProperty({
    description: "The bookstore's id",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "The bookstore's name",
    required: false,
    type: String
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    description: "The bookstore's address",
    required: false,
    type: String
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    description: "The bookstore's phone",
    required: false,
    type: String
  })
  @IsOptional()
  phone: string;

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
