import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class BookResponseDto {
  @ApiProperty({
    description: "The book name",
    type: String
  })
  @Expose()
  bookName: string;

  @ApiProperty({
    description: "The author name",
    type: String
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: "The publisher name",
    type: String
  })
  @Expose()
  publisher: string;

  @ApiProperty({
    description: "The published date",
    type: Date
  })
  @Expose()
  publishedDate: Date;

  @ApiProperty({
    description: "The price",
    type: Number
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: "The category",
    type: String
  })
  @Expose()
  category: string;
}
