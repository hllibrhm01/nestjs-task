import { PartialType } from "@nestjs/swagger";
import { CreateBookstoreBookDto } from "./create-bookstore-book.dto";

export class UpdateBookstoreBookDto extends PartialType(
  CreateBookstoreBookDto
) {}
