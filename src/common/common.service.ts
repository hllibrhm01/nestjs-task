import { SortByObject } from "../utils/sortBy";
import {
  Repository,
  DeepPartial,
  EntityManager,
  FindOneOptions
} from "typeorm";

type FilterQuery<T> = {};

export abstract class CommonService<T extends { [key: string]: any }> {
  protected constructor(
    protected readonly repository: Repository<T>,
    protected readonly manager?: EntityManager
  ) {}

  findAll(
    filter: FilterQuery<T> = {},
    limit: number | undefined = 10,
    skip: number | undefined = 0,
    sortBy: SortByObject | any
  ) {
    return this.repository.findAndCount({
      where: filter,
      take: limit,
      skip: skip,
      order: sortBy
    });
  }

  findOne(id: number) {
    const options: FindOneOptions = { where: { id } };
    return this.repository.findOne(options);
  }

  save(entity: DeepPartial<T>) {
    return this.repository.save(entity);
  }
}
