import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from "@nestjs/common";
import { CreateBookstoreBookDto } from "./dto/create-bookstore-book.dto";
import { UpdateBookstoreBookDto } from "./dto/update-bookstore-book.dto";
import { CommonService } from "../common/common.service";
import { BookstoreBook } from "./entities/bookstore-book.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder } from "typeorm";
import { User } from "../users/entities/user.entity";
import { BookstoresService } from "../bookstores/bookstores.service";
import { RoleEnum } from "../roles/roles.enum";
import {
  BookstoreBookQueryOrderBy,
  BookstoreBookQueryOrderDirection
} from "./bookstore-books.enum";
import { BooksService } from "../books/books.service";

@Injectable()
export class BookstoreBooksService extends CommonService<BookstoreBook> {
  constructor(
    @InjectRepository(BookstoreBook)
    private bookstoreBookRepository: Repository<BookstoreBook>,
    private readonly bookstoreService: BookstoresService,
    private bookService: BooksService
  ) {
    super(bookstoreBookRepository);
  }

  async create(user: User, createBookstoreBookDto: CreateBookstoreBookDto) {
    await this.storeManagerMatch(
      user,
      createBookstoreBookDto.bookstoreId,
      user.role
    );

    await this.bookService.findById(createBookstoreBookDto.bookId);

    await this.bookstoreService.findById(createBookstoreBookDto.bookstoreId);

    await this.checkBookstoreBookExists(
      createBookstoreBookDto.bookId,
      createBookstoreBookDto.bookstoreId
    );

    const bookstoreBook = this.bookstoreBookRepository.create(
      createBookstoreBookDto
    );
    return this.bookstoreBookRepository.save(bookstoreBook);
  }

  async storeManagerMatch(user: User, bookstoreId: number, role: RoleEnum) {
    if (role !== RoleEnum.ADMIN) {
      const store = await this.bookstoreService.findOne(bookstoreId);
      if (store?.managerId !== user.id) {
        throw new UnauthorizedException(
          `You are not authorized to do this store's operation`
        );
      }
    }
  }

  async checkBookstoreBookExists(bookId: number, bookstoreId: number) {
    const existingBook = await this.bookstoreBookRepository.findOne({
      where: { bookId: bookId, bookstoreId: bookstoreId }
    });

    if (existingBook)
      throw new BadRequestException(
        `Book already exists in this store. Please update the quantity instead.`
      );
  }

  async update(
    user: User,
    id: number,
    updateBookstoreBookDto: UpdateBookstoreBookDto
  ) {
    const bookstoreBook = await this.bookstoreBookRepository.findOne({
      where: { id }
    });

    if (!bookstoreBook)
      throw new NotFoundException(`Bookstore's book not found`);

    if (
      updateBookstoreBookDto.bookId !== undefined &&
      updateBookstoreBookDto.bookstoreId !== undefined
    ) {
      // await this.checkBookstoreBookExists(updateBookstoreBookDto.bookId, updateBookstoreBookDto.bookstoreId);
    }

    if (updateBookstoreBookDto.bookId !== undefined) {
      await this.bookService.findById(updateBookstoreBookDto.bookId);

      bookstoreBook.bookId = updateBookstoreBookDto.bookId;
    }

    if (updateBookstoreBookDto.bookstoreId !== undefined) {
      await this.bookstoreService.findById(updateBookstoreBookDto.bookstoreId);
      await this.storeManagerMatch(
        user,
        updateBookstoreBookDto.bookstoreId,
        user.role
      );

      bookstoreBook.bookstoreId = updateBookstoreBookDto.bookstoreId;
    }

    if (updateBookstoreBookDto.bookQuantity !== undefined) {
      bookstoreBook.bookQuantity = updateBookstoreBookDto.bookQuantity;
    }

    return await this.bookstoreBookRepository.save(bookstoreBook);
  }

  async findOneWithJoin(id: number) {
    const bookstoreBook = await this.bookstoreBookRepository.findOne({
      where: { id },
      relations: ["book", "bookstore"]
    });

    if (!bookstoreBook)
      throw new NotFoundException(`Bookstore's book not found`);

    return bookstoreBook;
  }

  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: BookstoreBookQueryOrderBy | undefined,
    orderDirection: BookstoreBookQueryOrderDirection,
    count: true
  ): Promise<number>;
  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined,
    skip: number | undefined,
    orderBy: BookstoreBookQueryOrderBy | undefined,
    orderDirection: BookstoreBookQueryOrderDirection,
    count: false
  ): Promise<BookstoreBook[]>;
  async getBookstoreBooksWithJoin(
    bookId: number | undefined,
    bookstoreId: number | undefined,
    limit: number | undefined = 10,
    skip: number | undefined = 0,
    orderBy: BookstoreBookQueryOrderBy | undefined,
    orderDirection: BookstoreBookQueryOrderDirection | undefined,
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

    if (count) return query.getCount();

    return query
      .orderBy(`bookstoreBook.${orderBy}`, orderDirection)
      .skip(skip)
      .take(limit)
      .getMany();
  }

  async remove(id: number) {
    const bookstoreBook = await this.bookstoreBookRepository.findOne({
      where: { id }
    });

    if (!bookstoreBook) throw new NotFoundException(`Bookstore book not found`);

    return await this.bookstoreBookRepository.remove(bookstoreBook);
  }
}
