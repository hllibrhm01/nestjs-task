import { ApiProperty } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { RoleEnum } from "../../roles/roles.enum";

export class CreateUserDto {
  @ApiProperty({
    description: "The name of the user",
    type: String
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: "The lastname of the user",
    type: String
  })
  @Expose()
  lastname: string;

  @ApiProperty({
    description: "The email of the user",
    type: String,
    example: "user@example.com"
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: "The password of the user",
    type: String
  })
  @Expose()
  password: string;

  @ApiProperty({
    description: "The user role",
    type: String,
    enum: RoleEnum
  })
  @Expose()
  role: RoleEnum;

  @ApiProperty({
    description: "The user status",
    type: Boolean
  })
  @Expose()
  isActive: boolean;
}
