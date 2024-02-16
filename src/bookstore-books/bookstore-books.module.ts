import { Module } from "@nestjs/common";
import { BookstoreBooksService } from "./bookstore-books.service";
import { BookstoreBooksController } from "./bookstore-books.controller";
import { ConfigModule } from "@nestjs/config";
import { BookstoreBook } from "./entities/bookstore-book.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BookstoresModule } from "../bookstores/bookstores.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([BookstoreBook]), 
    ConfigModule,
    BookstoresModule
  ],
  controllers: [BookstoreBooksController],
  providers: [BookstoreBooksService]
})
export class BookstoreBooksModule {}
