import { TokenType } from "../../token/token.enum";
import { User } from "../../users/entities/user.entity";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  BaseEntity
} from "typeorm";

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar" })
  tokenUUID: string;

  @Column({ type: "int" })
  @ManyToMany(() => User, (user) => user.id)
  userId: number;

  @Column({ type: "varchar" })
  tokenType: TokenType;

  @Column({ type: "timestamptz" })
  expiresAt: Date;

  @Column({ type: "boolean", default: false })
  blacklisted: boolean;

  @CreateDateColumn({ type: "timestamptz" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updatedAt: Date;
}
