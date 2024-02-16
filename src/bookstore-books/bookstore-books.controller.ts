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
import { SortByObject } from "../utils/sortBy";
import { BookstoreBookQueryOrderDirection } from "./bookstore-books.enum";
import { BookstoreBookJoinResponseDto } from "./dto/bookstore-book-join-response.dto";
import { CurrentUser } from "../auth/current-user.decorator";
import { User } from "../users/entities/user.entity";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";

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
  ) {
    try {
    const bookstoreBook = await this.bookstoreBooksService.create(
      user,
      createBookstoreBookDto
    );

    const response = new BookstoreBookOneResponseDto();
    response.result = bookstoreBook;
    return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async findAll(@Query() query: QueryBookstoreBookDto) {
    try {
      const limit = query.limit ?? 10;
      const page = query.page ?? 1;
      const skip = (page - 1) * limit;

      const orderBy = query.orderBy ?? -1;
      const sort: SortByObject = {};
      sort[orderBy] =
        query.orderDirection === BookstoreBookQueryOrderDirection.DESC ? -1 : 1;

      const count = await this.bookstoreBooksService.getBookstoreBooksWithJoin(
        query.bookId,
        query.bookstoreId,
        limit,
        skip,
        sort,
        true
      );

      const results =
        await this.bookstoreBooksService.getBookstoreBooksWithJoin(
          query.bookId,
          query.bookstoreId,
          limit,
          skip,
          sort,
          false
        );

      console.log(results);
      return results;

      // result.bookstore = results[0].bookstore;
      // const result = new PagedBookstoreBookResponseDto();
      // result.count = count;
      // result.page = page;
      // result.limit = limit;
      // result.result = results;

      // return result;
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    /*
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === BookstoreBookQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.bookId && { bookId: query.bookId }),
      ...(query.bookstoreId && { bookstoreId: query.bookstoreId })
    };

    const count = await this.bookstoreBooksService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.bookstoreBooksService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedBookstoreBookResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
    */
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
    const bookstoreBook = await this.bookstoreBooksService.findOne(id);

    if (!bookstoreBook)
      throw new NotFoundException(`Bookstore's book not found`);

    const response = new BookstoreBookOneResponseDto();
    response.result = bookstoreBook;
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
    @Param("id") id: number,
    @Body() updateBookstoreBookDto: UpdateBookstoreBookDto
  ) {
    try {
      const bookstoreBook = await this.bookstoreBooksService.update(
        id,
        updateBookstoreBookDto
      );

      const response = new BookstoreBookOneResponseDto();
      response.result = bookstoreBook;
      return response;
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
  remove(@Param("id") id: number) {
    return this.bookstoreBooksService.remove(id);
  }
}
