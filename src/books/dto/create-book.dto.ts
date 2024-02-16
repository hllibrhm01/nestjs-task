import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { Categories } from "../enums/categories.enum";

export class CreateBookDto {
  @ApiProperty({
    description: "The title of the book",
    type: String
  })
  @Expose()
  bookName: string;

  @ApiProperty({
    description: "The author of the book",
    type: String
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: "The publisher of the book",
    type: String
  })
  @Expose()
  publisher: string;

  @ApiProperty({
    description: "The published date of the book",
    type: Date
  })
  @Expose()
  publishedDate: Date;

  @ApiProperty({
    description: "The price of the book",
    type: Number
  })
  @Expose()
  price: number;

  @ApiProperty({
    description: "The category of the book",
    type: String,
    enum: Categories
  })
  @Expose()
  category: Categories;
}
