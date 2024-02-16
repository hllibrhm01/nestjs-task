import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { RoleEnum } from "../../roles/roles.enum";

export class RegisterDto {
  @ApiProperty({
    title: "Name",
    description: "Name of the user",
    example: "John Doe",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    title: "Lastname",
    description: "Lastname of the user",
    example: "Doe",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    title: "Email",
    description: "Email of the user",
    example: "user@example.com",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    title: "Password",
    description: "Password of the user",
    example: "password",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    title: "Role",
    description: "Role of the user",
    example: "user",
    type: String,
    enum: RoleEnum,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  role: RoleEnum;

  @ApiProperty({
    title: "Status",
    description: "Status of the user",
    example: "true",
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  isActive: boolean;
}
