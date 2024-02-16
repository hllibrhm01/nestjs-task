import { User } from "../users/entities/user.entity";

export class RoleAbilityHelper {
  static getAbilities(user: User, action: string) {
    // will be use enum for action
    switch (action) {
      case "createBookStoreBook":
        if (user.role === "admin") {
        }
    }
  }
}
