import { Expose, Type } from "class-transformer";
import { BookstoreResponseDto } from "./bookstore-response.dto";

export class BookstoreOneResponseDto {
  @Expose()
  @Type(() => BookstoreResponseDto)
  result: BookstoreResponseDto;
}
