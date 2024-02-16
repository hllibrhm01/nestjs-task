import { Body, Injectable, NotFoundException, Param } from "@nestjs/common";
import { CreateBookDto } from "./dto/create-book.dto";
import { UpdateBookDto } from "./dto/update-book.dto";
import { Repository } from "typeorm";
import { Book } from "./entities/book.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "../common/common.service";

@Injectable()
export class BooksService extends CommonService<Book> {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>
  ) {
    super(bookRepository);
  }

  create(createBookDto: CreateBookDto) {
    const book = this.bookRepository.create(createBookDto);

    if (createBookDto.price < 0) throw new Error("Price cannot be negative.");

    return this.bookRepository.save(book);
  }

  async update(@Param("id") id: number, @Body() updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) throw new NotFoundException(`Book not found`);

    if (updateBookDto.bookName) book.bookName = updateBookDto.bookName;
    if (updateBookDto.author) book.author = updateBookDto.author;
    if (updateBookDto.publisher) book.publisher = updateBookDto.publisher;
    if (updateBookDto.publishedDate)
      book.publishedDate = updateBookDto.publishedDate;
    if (updateBookDto.price) {
      book.price = updateBookDto.price;

      if (updateBookDto.price < 0) throw new Error("Price cannot be negative.");
    }
    if (updateBookDto.category) book.category = updateBookDto.category;

    return await this.bookRepository.save(book);
  }

  async findById(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) throw new NotFoundException(`Book not found`);

    return book;
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });

    if (!book) throw new NotFoundException(`Book not found`);

    return await this.bookRepository.remove(book);
  }
}
