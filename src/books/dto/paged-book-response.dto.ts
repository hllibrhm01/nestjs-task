import { Expose, Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { BookResponseDto } from "./book-response.dto";
import { ValidateNested } from "class-validator";

export class PagedBookResponseDto {
  @ApiProperty({
    description: "The list of books",
    type: BookResponseDto
  })
  @Type(() => BookResponseDto)
  @Expose()
  @ValidateNested({ each: true })
  result: BookResponseDto[];

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
