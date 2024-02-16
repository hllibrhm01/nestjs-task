import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { Bookstore } from "../entities/bookstore.entity";
import { BookstoreResponseDto } from "./bookstore-response.dto";
import { ValidateNested } from "class-validator";

export class PagedBookStoreResponseDto {
  @ApiProperty({
    description: "The list of books",
    type: BookstoreResponseDto
  })
  @Type(() => BookstoreResponseDto)
  @Expose()
  @ValidateNested({ each: true })
  result: BookstoreResponseDto[];

  @ApiProperty({
    description: "The total number of bookstores",
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
    description: "The number of bookstores per page",
    type: Number,
    example: 10
  })
  @Expose()
  limit: number;
}
