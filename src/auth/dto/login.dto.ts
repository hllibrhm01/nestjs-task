import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
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
}
