import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { RoleEnum } from "../../roles/roles.enum";
import * as bcrypt from "bcrypt";
import { Exclude } from "class-transformer";
import { Bookstore } from "../../bookstores/entities/bookstore.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  lastname: string;

  @Column({ type: "varchar", unique: true, nullable: false })
  email: string;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ type: "varchar", nullable: false })
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({
    type: "varchar",
    length: 15,
    default: RoleEnum.USER,
    nullable: false
  })
  role: RoleEnum;

  @Column({ type: "boolean", default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;

  @OneToOne(() => Bookstore, (bookstore) => bookstore.managers)
  @JoinColumn({ name: "managerId" })
  bookstore: Bookstore;

  async isPasswordMatch(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.password);
  }
}
