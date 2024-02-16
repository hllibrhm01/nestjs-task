import { Module } from "@nestjs/common";
import { BookstoresService } from "./bookstores.service";
import { BookstoresController } from "./bookstores.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Bookstore } from "./entities/bookstore.entity";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "../users/users.module";

@Module({
  imports: [TypeOrmModule.forFeature([Bookstore]), ConfigModule, UsersModule],
  controllers: [BookstoresController],
  exports: [BookstoresService],
  providers: [BookstoresService]
})
export class BookstoresModule {}
