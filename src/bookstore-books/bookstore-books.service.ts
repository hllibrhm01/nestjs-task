import { BadRequestException, Body, Injectable, NotFoundException, Param, UnauthorizedException } from "@nestjs/common";
import { CreateBookstoreBookDto } from "./dto/create-bookstore-book.dto";
import { UpdateBookstoreBookDto } from "./dto/update-bookstore-book.dto";
import { CommonService } from "../common/common.service";
import { BookstoreBook } from "./entities/bookstore-book.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { QueryBookstoreBookDto } from "./dto/query-bookstore-book.dto";
import { SortByObject } from "../utils/sortBy";
import { User } from "../users/entities/user.entity";
import { BookstoresService } from "../bookstores/bookstores.service";
import { RoleEnum } from "../roles/roles.enum";

@Injectable()
export class BookstoreBooksService extends CommonService<BookstoreBook> {
  constructor(
    @InjectRepository(BookstoreBook)
    private bookstoreBookRepository: Repository<BookstoreBook>,
    private readonly bookstoreService: BookstoresService
  ) {
    super(bookstoreBookRepository);
  }

  // rolü manager olan bir kullanıcı kendi mağazasına kitap ekleyebilir ve silebilir
  async create(user: User, createBookstoreBookDto: CreateBookstoreBookDto) {

    if (user.role !== RoleEnum.ADMIN) await this.storeManagerMatch(user, createBookstoreBookDto.bookstoreId);

    const existingBook = await this.bookstoreBookRepository.findOne({
      where: { bookId: createBookstoreBookDto.bookId, bookstoreId: createBookstoreBookDto.bookstoreId }
    });

    if (existingBook) throw new BadRequestException(`Book already exists in this store. Please update the quantity instead.`);
    
    const bookstoreBook = this.bookstoreBookRepository.create(
      createBookstoreBookDto
    );
    return this.bookstoreBookRepository.save(bookstoreBook);
  }

  async storeManagerMatch(user: User, bookstoreId: number) {  
    const store = await this.bookstoreService.findOne(bookstoreId);
    if (store?.managerId !== user.id) {
      throw new UnauthorizedException(`You are not authorized to do this store's operation`);
    }
  }

  async update(
    @Param("id") id: number,
    @Body() updateBookstoreBookDto: UpdateBookstoreBookDto
  ) {
    const bookstoreBook = await this.bookstoreBookRepository.findOne({
      where: { id }
    });

    if (!bookstoreBook) throw new NotFoundException(`Bookstore book not found`);

    if (updateBookstoreBookDto.bookId)
      bookstoreBook.bookId = updateBookstoreBookDto.bookId;
    if (updateBookstoreBookDto.bookstoreId)
      bookstoreBook.bookstoreId = updateBookstoreBookDto.bookstoreId;

    return await this.bookstoreBookRepository.save(bookstoreBook);
  }

  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    sortBy: SortByObject | any,
    count: true
  ): Promise<number>;
  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    sortBy: SortByObject | any,
    count: false
  ): Promise<BookstoreBook[]>;
  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined = 10,
    skip: number | undefined = 0,
    sortBy: SortByObject | any = {},
    count: boolean = false
  ): Promise<BookstoreBook[] | number> {
    const queryBuilder: SelectQueryBuilder<BookstoreBook> =
      this.bookstoreBookRepository.createQueryBuilder("bookstoreBook");

    const query = queryBuilder
      .innerJoinAndSelect("bookstoreBook.book", "book")
      .innerJoinAndSelect("bookstoreBook.bookstore", "bookstore");

    if (bookId !== undefined) {
      query.where("bookstoreBook.bookId = :id", { id: bookId });
    }

    if (bookstoreId !== undefined) {
      query.where("bookstoreBook.bookstoreId = :id", { id: bookstoreId });
    }

    // if (filter) query.where(filter);

    return query.getCount();

    // return query.getMany();

    // const query = queryBuilder
    //   .leftJoinAndSelect("bookstoreBook.book", "book")
    //   .leftJoinAndSelect("bookstoreBook.bookstore", "bookstore")
    //   .select(["bookstoreBook", "book.id", "book.bookName", "book.author", "book.publisher", "book.publishedDate", "book.price", "book.quantity", "book.category", "book.createdAt", "book.updatedAt", "bookstore.id", "bookstore.name", "bookstore.address", "bookstore.phone", "bookstore.createdAt", "bookstore.updatedAt"])
    //   .orderBy("bookstoreBook.createdAt", "DESC")
    //   .getMany();

    // return query;

    /*
    const query = this.bookstoreBookRepository
      .createQueryBuilder("bookstoreBook")
      .leftJoinAndSelect("bookstoreBook.book", "book")
      .leftJoinAndSelect("bookstoreBook.bookstore", "bookstore");

    if (bookId !== undefined) query.andWhere("bookstoreBook.bookId = :bookId", { bookId });
    if (bookstoreId !== undefined)
      query.andWhere("bookstoreBook.bookstoreId = :bookstoreId", {
        bookstoreId
      });

    if (count) return query.getCount();

    return query
      .orderBy(`bookstoreBook.${sortBy.sortBy}`, sortBy.order)
      .skip(skip)
      .take(limit)
      .getMany();
      */
  }

  async remove(id: number) {
    const bookstoreBook = await this.bookstoreBookRepository.findOne({
      where: { id }
    });

    if (!bookstoreBook) throw new NotFoundException(`Bookstore book not found`);

    return await this.bookstoreBookRepository.remove(bookstoreBook);
  }
}
