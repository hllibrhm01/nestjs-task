import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { UsersService } from "./users/users.service";
import { RoleEnum } from "./roles/roles.enum";

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private userService: UsersService) {}

  onApplicationBootstrap(): any {
    this.adminUserSeed();
  }

  async adminUserSeed() {
    const count = await this.userService.findAll(
      {},
      undefined,
      undefined,
      null
    );

    if (count[1] === 0) {
      const user = {
        name: "admin",
        lastname: "admin",
        email: "admin@admin.com",
        password: "admin",
        role: RoleEnum.ADMIN,
        isActive: true
      };
      await this.userService.create(user);

      console.log("Admin user created");
    }
  }
}
