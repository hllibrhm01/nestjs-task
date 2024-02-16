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
import { BookQueryOrderBy, BookQueryOrderDirection } from "../books.enum";

export class QueryBookDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: BookQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(BookQueryOrderBy)
  @IsOptional()
  orderBy?: BookQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: BookQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(BookQueryOrderDirection)
  @IsOptional()
  orderDirection?: BookQueryOrderDirection;

  @ApiProperty({
    description: "The book's id",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: "The book's name",
    required: false,
    type: String
  })
  @IsOptional()
  bookName: string;

  @ApiProperty({
    description: "The book's author",
    required: false,
    type: String
  })
  @IsOptional()
  @IsString()
  author: string;

  @ApiProperty({
    description: "Page number",
    type: "number",
    example: 1,
    default: 1,
    required: false
  })
  @Transform(({ obj, key }) => {
    return parseInt(obj[key], 10);
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: "Number of items per page",
    type: "number",
    example: 10,
    default: 10,
    required: false
  })
  @Transform(({ obj, key }) => {
    return parseInt(obj[key], 10);
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
