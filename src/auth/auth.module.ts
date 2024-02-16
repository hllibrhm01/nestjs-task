import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Token } from "./entities/token.entity";
import { UsersModule } from "../users/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [TypeOrmModule.forFeature([Token]), UsersModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
