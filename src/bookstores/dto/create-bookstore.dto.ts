import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class CreateBookstoreDto {
  @ApiProperty({
    description: "The name of the bookstore",
    type: String,
    required: true
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "The address of the bookstore",
    type: String,
    required: true
  })
  @Expose()
  address: string;

  @ApiProperty({
    description: "The phone number of the bookstore",
    type: String,
    required: true
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: "The manager ID of the bookstore",
    type: Number,
    required: true
  })  
  @Expose()
  managerId: number;
}
