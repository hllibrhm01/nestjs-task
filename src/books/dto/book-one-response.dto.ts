import { Expose, Type } from "class-transformer";
import { BookResponseDto } from "./book-response.dto";

export class BookOneResponseDto {
  @Expose()
  @Type(() => BookResponseDto)
  result: BookResponseDto;
}
