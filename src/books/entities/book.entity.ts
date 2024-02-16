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

  @Column({ type: "varchar", nullable: false })
  bookName: string;

  @Column({ type: "varchar", nullable: false })
  author: string;

  @Column({ type: "varchar", nullable: false })
  publisher: string;

  @Column({ type: "timestamptz", nullable: false })
  publishedDate: Date;

  @Column({ type: "int", default: 0, nullable: false })
  price: number;

  @Column({ type: "enum", enum: Categories, nullable: false })
  category: Categories;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => BookstoreBook, (bookstoreBook) => bookstoreBook.book)
  @JoinColumn({ name: "id" })
  bookstoreBooks: BookstoreBook[];
}
