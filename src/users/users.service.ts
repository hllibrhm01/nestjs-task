import { Body, Injectable, NotFoundException, Param } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { CommonService } from "../common/common.service";

@Injectable()
export class UsersService extends CommonService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto);

    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) throw new Error("User with this email already exists");

    return this.userRepository.save(user);
  }

  findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async update(@Param("id") id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User not found`);

    if (updateUserDto.name) user.name = updateUserDto.name;
    if (updateUserDto.lastname) user.lastname = updateUserDto.lastname;
    if (updateUserDto.password) user.password = updateUserDto.password;
    if (updateUserDto.email) user.email = updateUserDto.email;
    if (updateUserDto.role) user.role = updateUserDto.role;
    if (updateUserDto.isActive) user.isActive = updateUserDto.isActive;

    return await this.userRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throw new NotFoundException(`User not found`);

    return await this.userRepository.remove(user);
  }
}
