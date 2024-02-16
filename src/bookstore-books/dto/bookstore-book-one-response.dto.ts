import { Expose, Type } from "class-transformer";
import { BookstoreBookResponseDto } from "./bookstore-book-response.dto";

export class BookstoreBookOneResponseDto {
  @Expose()
  @Type(() => BookstoreBookResponseDto)
  result: BookstoreBookResponseDto;
}
