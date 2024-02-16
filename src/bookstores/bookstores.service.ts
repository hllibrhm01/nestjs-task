import {
  Body,
  Injectable,
  NotFoundException,
  Param,
  Req
} from "@nestjs/common";
import { CreateBookstoreDto } from "./dto/create-bookstore.dto";
import { UpdateBookstoreDto } from "./dto/update-bookstore.dto";
import { CommonService } from "../common/common.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Bookstore } from "./entities/bookstore.entity";
import { Repository } from "typeorm";
import { UsersService } from "../users/users.service";

@Injectable()
export class BookstoresService extends CommonService<Bookstore> {
  constructor(
    @InjectRepository(Bookstore)
    private bookstoreRepository: Repository<Bookstore>,
    private userSerivce: UsersService
  ) {
    super(bookstoreRepository);
  }

  storeManagerCheck(managerId: number) {
    return this.bookstoreRepository.findOne({
      where: { managerId }
    });
  }

  async create(createBookstoreDto: CreateBookstoreDto) {
    const bookstore = this.bookstoreRepository.create(createBookstoreDto);

    const existingPhone = await this.bookstoreRepository.findOne({
      where: { phone: createBookstoreDto.phone }
    });

    const existingName = await this.bookstoreRepository.findOne({
      where: { name: createBookstoreDto.name }
    });

    const userExists = await this.userSerivce.findOne(createBookstoreDto.managerId);

    const manager = await this.bookstoreRepository.findOne({
      where: { managerId: createBookstoreDto.managerId }
    });

    if (manager)
      throw new NotFoundException(
        `Manager ${createBookstoreDto.managerId} already exists`
      );

    if (!userExists) throw new NotFoundException(`User not found`);

    if (existingPhone)
      throw new NotFoundException(
        `Phone number ${createBookstoreDto.phone} already exists`
      );
    
    if (existingName)
      throw new NotFoundException(
        `Bookstore ${createBookstoreDto.name} already exists`
      );

    return this.bookstoreRepository.save(bookstore);
  }

  async update(
    @Param("id") id: number,
    @Body() updateBookstoreDto: UpdateBookstoreDto
  ) {
    const bookstore = await this.bookstoreRepository.findOne({ where: { id } });

    if (!bookstore) throw new NotFoundException(`Bookstore not found`);

    const existingPhone = await this.bookstoreRepository.findOne({
      where: { phone: updateBookstoreDto.phone }
    });

    const existingName = await this.bookstoreRepository.findOne({
      where: { name: updateBookstoreDto.name }
    });

    const manager = await this.bookstoreRepository.findOne({
      where: { managerId: updateBookstoreDto.managerId }
    });

    if (manager && manager.id !== id)
      throw new NotFoundException(
        `Manager ${updateBookstoreDto.managerId} already exists please choose another manager`
      );

    if (updateBookstoreDto.managerId !== undefined) {
      const userExists = await this.userSerivce.findOne(
        updateBookstoreDto.managerId
      );

      if (!userExists) throw new NotFoundException(`User not found`);
    }

    if (existingPhone && existingPhone.id !== id)
      throw new NotFoundException(
        `Phone number ${updateBookstoreDto.phone} already exists`
      );

    if (existingName && existingName.id !== id)
      throw new NotFoundException(
        `Bookstore ${updateBookstoreDto.name} already exists`
      );

    if (updateBookstoreDto.name) bookstore.name = updateBookstoreDto.name;
    if (updateBookstoreDto.address)
      bookstore.address = updateBookstoreDto.address;
    if (updateBookstoreDto.phone) bookstore.phone = updateBookstoreDto.phone;

    return this.bookstoreRepository.save(bookstore);
  }

  async remove(id: number) {
    const bookstore = await this.bookstoreRepository.findOne({ where: { id } });

    if (!bookstore) throw new NotFoundException(`Bookstore not found`);

    return this.bookstoreRepository.remove(bookstore);
  }
}
