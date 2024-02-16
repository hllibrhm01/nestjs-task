import { BookstoreBook } from "../../bookstore-books/entities/bookstore-book.entity";
import { User } from "../../users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinColumn,
  OneToOne
} from "typeorm";

@Entity()
export class Bookstore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  address: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  phone: string;

  @Column({ type: "int", nullable: false })
  managerId: number;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToMany(() => BookstoreBook, (bookstoreBook) => bookstoreBook.bookstore)
  @JoinColumn({ name: "id" })
  bookstoreBooks: BookstoreBook[];

  @OneToOne(() => User, (user) => user.bookstore)
  @JoinColumn({ name: "id" })
  managers: User[];
}
