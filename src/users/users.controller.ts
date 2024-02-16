import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  SerializeOptions,
  UseFilters,
  Query,
  NotFoundException,
  UseGuards,
  BadRequestException
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiTags
} from "@nestjs/swagger";
import { QueryUserDto } from "./dto/query-user.dto";
import { SortByObject } from "../utils/sortBy";
import { UserQueryOrderDirection } from "./users.enum";
import { PagedUserResponseDto } from "./dto/paged-user-response.dto";
import { UserOneResponseDto } from "./dto/user-one-response.dto";
import { Roles } from "../roles/roles.decorator";
import { RoleEnum } from "../roles/roles.enum";
import { RolesGuard } from "../roles/roles.guard";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("users")
@ApiBearerAuth()

@SerializeOptions({
  excludeExtraneousValues: true,
  excludePrefixes: ["_", "$"],
  enableCircularCheck: true
})
@UseInterceptors(ClassSerializerInterceptor)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async create (@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);

      const response = new UserOneResponseDto();
      response.result = user;
      return response;
    } catch (error) { 
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findAll(@Query() query: QueryUserDto) {
    const limit: number = query.limit ?? 10;
    const page: number = query.page ?? 1;
    const skip = (page - 1) * limit;

    const orderBy = query.orderBy ?? -1;
    const sort: SortByObject = {};
    sort[orderBy] =
      query.orderDirection === UserQueryOrderDirection.DESC ? -1 : 1;

    const queryObject = {
      ...(query.id && { id: query.id }),
      ...(query.name && { name: query.name }),
      ...(query.lastname && { lastname: query.lastname }),
      ...(query.email && { email: query.email }),
      ...(query.role && { role: query.role }),
      ...(query.isActive && { isActive: query.isActive })
    };

    const count = await this.usersService.findAll(
      queryObject,
      undefined,
      undefined,
      null
    );

    const results = await this.usersService.findAll(
      queryObject,
      limit,
      skip,
      sort
    );

    const result = new PagedUserResponseDto();
    result.count = count[1];
    result.page = page;
    result.limit = limit;
    result.result = results[0];

    return result;
  }

  @ApiParam({
    name: "id",
    description: "The user's id",
    type: Number,
    example: 1
  })
  @Get(":id")
  @ApiNotFoundResponse({ description: "User not found" })
  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async findOne(@Param("id") id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) throw new NotFoundException("User not found");

    const response = new UserOneResponseDto();
    response.result = user;
    return response;
  }

  @ApiParam({
    name: "id",
    description: "User id",
    type: Number,
    example: 1
  })
  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    try {
      const user = await this.usersService.update(id, updateUserDto);

      const response = new UserOneResponseDto();
      response.result = user;
      return response;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  remove(@Param("id") id: number) {
    return this.usersService.remove(id);
  }
}
