import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

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
}
