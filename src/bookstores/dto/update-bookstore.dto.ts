import { PartialType } from "@nestjs/swagger";
import { CreateBookstoreDto } from "./create-bookstore.dto";

export class UpdateBookstoreDto extends PartialType(CreateBookstoreDto) {}
