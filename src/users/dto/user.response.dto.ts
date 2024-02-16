import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";

export class UserResponseDto {
  @ApiProperty({
    description: "Name of the user",
    type: String
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "Lastname of the user",
    type: String
  })
  @Expose()
  lastname: string;

  @ApiProperty({
    description: "Email of the user",
    type: String
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "The user role",
    type: String
  })
  @Expose()
  role: string;

  @ApiProperty({
    description: "The user status",
    type: Boolean
  })
  @Expose()
  isActive: boolean;
}
