import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class BookstoreResponseDto {
  @ApiProperty({
    description: "The name of the bookstore",
    type: String
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "The address of the bookstore",
    type: String
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: "The phone number of the bookstore",
    type: String
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: "The manager ID of the bookstore",
    type: Number
  })
  @Expose()
  managerId: number;
}
