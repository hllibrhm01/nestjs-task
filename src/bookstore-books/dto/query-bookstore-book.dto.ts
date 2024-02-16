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
  BookstoreBookQueryOrderBy,
  BookstoreBookQueryOrderDirection
} from "../bookstore-books.enum";

export class QueryBookstoreBookDto {
  @ApiProperty({
    description: "Order by a specific field",
    type: String,
    example: BookstoreBookQueryOrderBy.CREATED,
    required: false
  })
  @IsEnum(BookstoreBookQueryOrderBy)
  @IsOptional()
  orderBy?: BookstoreBookQueryOrderBy;

  @ApiProperty({
    description: "Direction to order by",
    type: String,
    example: BookstoreBookQueryOrderDirection.ASC,
    required: false
  })
  @IsEnum(BookstoreBookQueryOrderDirection)
  @IsOptional()
  orderDirection?: BookstoreBookQueryOrderDirection;

  @ApiProperty({
    description: "The book's id",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  bookId: number;

  @ApiProperty({
    description: "The bookstore's id",
    required: false,
    type: Number
  })
  @IsOptional()
  @IsNumber()
  bookstoreId: number;

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
