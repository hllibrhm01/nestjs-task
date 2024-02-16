import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  SerializeOptions,
  ClassSerializerInterceptor,
  UseInterceptors,
  Query,
  NotFoundException,
  HttpCode,
  Req,
  UseGuards,
  BadRequestException
} from "@nestjs/common";
import { BookstoresService } from "./bookstores.service";
import { CreateBookstoreDto } from "./dto/create-bookstore.dto";
import { UpdateBookstoreDto } from "./dto/update-bookstore.dto";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { BookstoreOneResponseDto } from "./dto/bookstore-one-response.dto";
import { QueryBookstoreDto } from "./dto/query-bookstore.dto";
import { SortByObject } from "../utils/sortBy";
import { BookStoreQueryOrderDirection } from "./bookstores.enum";
import { PagedBookStoreResponseDto } from "./dto/paged-bookstore-response.dto";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";
import { RolesGuard } from "../roles/roles.guard";

@ApiTags("bookstores")
@ApiBearerAuth()
@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller("bookstores")
export class BookstoresController {
  constructor(private readonly bookstoresService: BookstoresService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create(@Body() createBookstoreDto: CreateBookstoreDto) {
    const bookstore = await this.bookstoresService.create(createBookstoreDto);

    const response = new BookstoreOneResponseDto();
    response.result = bookstore;
    return response;
  }

  @Get()
  async findAll(@Query() query: QueryBookstoreDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === BookStoreQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.id && { id: query.id }),
      ...(query.name && { name: query.name }),
      ...(query.address && { address: query.address }),
      ...(query.phone && { phone: query.phone })
    };

    const count = await this.bookstoresService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.bookstoresService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedBookStoreResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
  }

  @ApiParam({
    name: "id",
    description: "The bookstore's id",
    type: Number,
    example: 1
  })
  @Get(":id")
  @ApiNotFoundResponse({ description: "Bookstore not found" })
  async findOne(@Param("id") id: number) {
    const bookstore = await this.bookstoresService.findOne(id);

    if (!bookstore) throw new NotFoundException("Bookstore not found");

    const response = new BookstoreOneResponseDto();
    response.result = bookstore;
    return response;
  }

  @ApiParam({
    name: "id",
    description: "Bookstore id",
    type: Number,
    example: 1
  })
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(
    @Body() updateBookstoreDto: UpdateBookstoreDto,
    @Param("id") id: number
  ) {
    try {
      const bookstore = await this.bookstoresService.update(
        id,
        updateBookstoreDto
      );

      const response = new BookstoreOneResponseDto();
      response.result = bookstore;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @ApiProperty({
    name: "id",
    description: "The bookstore's id to delete",
    type: Number,
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: "The bookstore has been successfully deleted"
  })
  @HttpCode(200)
  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  remove(@Param("id") id: number) {
    return this.bookstoresService.remove(id);
  }
}
