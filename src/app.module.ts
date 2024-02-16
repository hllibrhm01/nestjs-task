import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";
import { BooksModule } from "./books/books.module";
import { BookstoresModule } from "./bookstores/bookstores.module";
import { BookstoreBooksModule } from "./bookstore-books/bookstore-books.module";
import { Book } from "./books/entities/book.entity";
import { Bookstore } from "./bookstores/entities/bookstore.entity";
import { BookstoreBook } from "./bookstore-books/entities/bookstore-book.entity";
import { AuthModule } from "./auth/auth.module";
import { DevtoolsModule } from "@nestjs/devtools-integration";
import { APP_GUARD } from "@nestjs/core";
import { Token } from "./auth/entities/token.entity";
import { TokenModule } from "./token/token.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";
import { AppService } from "./app.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env"
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST"),
        port: configService.get("DATABASE_PORT"),
        username: configService.get("DATABASE_USER"),
        password: configService.get("DATABASE_PASSWORD"),
        database: configService.get("DATABASE_NAME"),
        entities: [User, Book, Bookstore, BookstoreBook, Token],
        synchronize: true,
        logging: false,
        softDelete: true,
        dropSchema: true
      }),
      inject: [ConfigService]
    }),
    TokenModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        localPort: configService.get("PORT"),
        privateKey: configService.get("JWT_PRIVATE"),
        localPublicKey: configService.get("JWT_MOCK_PUBLIC")
      }),
      inject: [ConfigService]
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV === "development",
      port: 8001
    }),
    UsersModule,
    BooksModule,
    BookstoresModule,
    BookstoreBooksModule,
    AuthModule
  ],
  controllers: [],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ]
})
export class AppModule {}
