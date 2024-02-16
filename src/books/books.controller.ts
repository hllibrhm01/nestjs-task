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
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { QueryBookDto } from "./dto/query-book.dto";
import { SortByObject } from "../utils/sortBy";
import { BookQueryOrderDirection } from "./books.enum";
import { PagedBookResponseDto } from "./dto/paged-book-response.dto";
import { BookOneResponseDto } from "./dto/book-one-response.dto";
import { RolesGuard } from "../roles/roles.guard";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";

@ApiTags("books")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Post()
  async create(@Body() createBookDto: CreateBookDto) {
    const book = await this.booksService.create(createBookDto);

    const response = new BookOneResponseDto();
    response.result = book;
    return response;
  }

  @Get()
  async findAll(@Query() query: QueryBookDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === BookQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.id && { id: query.id }),
      ...(query.bookName && { bookName: query.bookName }),
      ...(query.author && { author: query.author })
    };

    const count = await this.booksService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.booksService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedBookResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
  }

  @ApiParam({
    name: "id",
    description: "The book's id",
    type: Number,
    example: 1
  })
  @Get(":id")
  @ApiNotFoundResponse({ description: "Book not found" })
  async findOne(@Param("id") id: number) {
    const book = await this.booksService.findOne(id);

    if (!book) throw new NotFoundException("Book not found");

    const response = new BookOneResponseDto();
    response.result = book;
    return response;
  }

  @ApiParam({
    name: "id",
    description: "Book id",
    type: Number,
    example: 1
  })
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(@Param("id") id: number, @Body() updateBookDto: UpdateBookDto) {
    try {
      const book = await this.booksService.update(id, updateBookDto);

      const response = new BookOneResponseDto();
      response.result = book;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiProperty({
    name: "id",
    description: "The book's id to delete",
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: "The book has been successfully deleted"
  })
  @HttpCode(200)
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async remove(@Param("id") id: number) {
    await this.booksService.remove(id);

    return { result: "Book has been successfully deleted" };
  }
}
