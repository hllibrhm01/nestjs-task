import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { BookResponseDto } from "../../books/dto/book-response.dto";
import { BookstoreOneResponseDto } from "../../bookstores/dto/bookstore-one-response.dto";

export class BookstoreBookResponseDto {
  @ApiProperty({
    description: "The id of the book",
    type: Number,
    example: 1
  })
  @Expose()
  bookId: number;

  @ApiProperty({
    description: "The id of the bookstore",
    type: Number,
    example: 1
  })
  @Expose()
  bookstoreId: number;

  @ApiProperty({
    description: "The quantity of the book",
    type: Number,
    example: 10
  })
  @Expose()
  bookQuantity: number;

  @ApiProperty({
    description: "The book",
    type: BookResponseDto
  })
  @Expose()
  @Type(() => BookResponseDto)
  @ValidateNested()
  book: BookResponseDto;

  @ApiProperty({
    description: "The bookstore",
    type: BookstoreOneResponseDto
  })
  @Expose()
  @Type(() => BookstoreOneResponseDto)
  @ValidateNested()
  bookstore: BookstoreOneResponseDto;
}
