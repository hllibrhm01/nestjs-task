import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Categories } from "../enums/categories.enum";
import { BookstoreBook } from "../../bookstore-books/entities/bookstore-book.entity";

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  bookName: string;

  @Column({ type: "varchar" })
  author: string;

  @Column({ type: "varchar" })
  publisher: string;

  @Column({ type: "timestamptz" })
  publishedDate: Date;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "enum", enum: Categories })
  category: Categories;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => BookstoreBook, (bookstoreBook) => bookstoreBook.book)
  @JoinColumn({ name: "id" })
  bookstoreBooks: BookstoreBook[];
}
