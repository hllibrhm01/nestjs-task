import { Module } from "@nestjs/common";
import { BooksService } from "./books.service";
import { BooksController } from "./books.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";
import { Book } from "./entities/book.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Book]), ConfigModule],
  controllers: [BooksController],
  exports: [BooksService],
  providers: [BooksService]
})
export class BooksModule {}
