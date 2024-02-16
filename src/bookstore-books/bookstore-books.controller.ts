import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  NotFoundException,
  HttpCode,
  UseGuards,
  BadRequestException
} from "@nestjs/common";
import { BookstoreBooksService } from "./bookstore-books.service";
import { CreateBookstoreBookDto } from "./dto/create-bookstore-book.dto";
import { UpdateBookstoreBookDto } from "./dto/update-bookstore-book.dto";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { BookstoreBookOneResponseDto } from "./dto/bookstore-book-one-response.dto";
import { QueryBookstoreBookDto } from "./dto/query-bookstore-book.dto";
import {
  BookstoreBookQueryOrderBy,
  BookstoreBookQueryOrderDirection
} from "./bookstore-books.enum";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";
import { PagedBookstoreBookResponseDto } from "./dto/paged-bookstore-book-response.dto";
import { BookstoreBookResponseDto } from "./dto/bookstore-book-response.dto";
import { BookstoreOneResponseDto } from "../bookstores/dto/bookstore-one-response.dto";

@ApiTags("bookstore-books")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller("bookstore-books")
export class BookstoreBooksController {
  constructor(private readonly bookstoreBooksService: BookstoreBooksService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.STORE_MANAGER, RoleEnum.ADMIN)
  async create(
    @CurrentUser() user: User,
    @Body() createBookstoreBookDto: CreateBookstoreBookDto
  ): Promise<BookstoreBookOneResponseDto> {
    try {
      const bookstoreBook = await this.bookstoreBooksService.create(
        user,
        createBookstoreBookDto
      );

      const response = new BookstoreBookOneResponseDto();
      response.result = response.result;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @ApiResponse({
    type: PagedBookstoreBookResponseDto
  })
  async findAll(
    @Query() query: QueryBookstoreBookDto
  ): Promise<PagedBookstoreBookResponseDto> {
    try {
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const skip = (page - 1) * limit;

      const queryOrderBy =
        query.orderBy === undefined
          ? BookstoreBookQueryOrderBy.CREATED
          : query.orderBy;
      const queryOrderDirection =
        query.orderDirection === undefined
          ? BookstoreBookQueryOrderDirection.DESC
          : query.orderDirection;

      const count = await this.bookstoreBooksService.getBookstoreBooksWithJoin(
        query.bookId,
        query.bookstoreId,
        limit,
        skip,
        queryOrderBy,
        queryOrderDirection,
        true
      );

      const results =
        await this.bookstoreBooksService.getBookstoreBooksWithJoin(
          query.bookId,
          query.bookstoreId,
          limit,
          skip,
          queryOrderBy,
          queryOrderDirection,
          false
        );

      const result = new PagedBookstoreBookResponseDto();
      result.count = count;
      result.page = page;
      result.limit = limit;
      result.result = results.map((bookstoreBook) => {
        const response = new BookstoreBookResponseDto();
        response.bookId = bookstoreBook.bookId;
        response.bookstoreId = bookstoreBook.bookstoreId;
        response.book = bookstoreBook.book;
        response.bookQuantity = bookstoreBook.bookQuantity;
        response.bookstore = new BookstoreOneResponseDto();
        response.bookstore.result = bookstoreBook.bookstore;

        return response;
      });
      return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiParam({
    name: "id",
    description: "The bookstore's book id",
    type: Number,
    example: 1
  })
  @Get(":id")
  @ApiNotFoundResponse({ description: "Bookstore's book not found" })
  async findOne(@Param("id") id: number) {
    const result = await this.bookstoreBooksService.findOneWithJoin(id);

    if (!result) throw new NotFoundException(`Bookstore's book not found`);

    const response = new BookstoreBookOneResponseDto();
    response.result = new BookstoreBookResponseDto();
    response.result.bookId = result.bookId;
    response.result.bookstoreId = result.bookstoreId;
    response.result.book = result.book;
    response.result.bookQuantity = result.bookQuantity;
    response.result.bookstore = new BookstoreOneResponseDto();
    response.result.bookstore.result = result.bookstore;

    return response;
  }

  @ApiParam({
    name: "id",
    description: "Bookstore's book id",
    type: Number,
    example: 1
  })
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.STORE_MANAGER)
  async update(
    @CurrentUser() user: User,
    @Param("id") id: number,
    @Body() updateBookstoreBookDto: UpdateBookstoreBookDto
  ) {
    try {
      await this.bookstoreBooksService.update(user, id, updateBookstoreBookDto);

      return { result: "Bookstore's book has been successfully updated" };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiProperty({
    name: "id",
    description: "The bookstore's book id to delete",
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: "The bookstore's book has been successfully deleted"
  })
  @HttpCode(200)
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async remove(@Param("id") id: number) {
    await this.bookstoreBooksService.remove(id);

    return { result: "Bookstore's book has been successfully deleted" };
  }
}
