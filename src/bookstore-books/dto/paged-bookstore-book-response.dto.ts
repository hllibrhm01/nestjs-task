import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BookstoreBookResponseDto } from "./bookstore-book-response.dto";
import { ValidateNested } from "class-validator";

export class PagedBookstoreBookResponseDto {
  @ApiProperty({
    description: "The list of bookstore books",
    type: BookstoreBookResponseDto
  })
  @Type(() => BookstoreBookResponseDto)
  @Expose()
  @ValidateNested({ each: true })
  result: BookstoreBookResponseDto[];

  @ApiProperty({
    description: "The total number of books",
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
    description: "The number of books per page",
    type: Number,
    example: 10
  })
  @Expose()
  limit: number;
}
