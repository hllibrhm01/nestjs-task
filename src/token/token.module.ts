import { Module } from "@nestjs/common";
import { ConfigurableModuleClass } from "./token.module-definition";
import { TokenService } from "./token.service";

@Module({
  providers: [TokenService],
  exports: [TokenService]
})
export class TokenModule extends ConfigurableModuleClass {}
