import { Book } from "../../books/entities/book.entity";
import { Bookstore } from "../../bookstores/entities/bookstore.entity";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";

@Entity()
export class BookstoreBook extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int" })
  bookId: number;

  @Column({ type: "int" })
  bookstoreId: number;

  @Column({ type: "int" })
  bookQuantity: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @ManyToOne(() => Bookstore, (bookstore) => bookstore.bookstoreBooks)
  @JoinColumn({ name: "bookstoreId" })
  bookstore: Bookstore;

  @ManyToOne(() => Book, (book) => book.bookstoreBooks)
  @JoinColumn({ name: "bookId" })
  book: Book;
}
