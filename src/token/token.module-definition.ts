import { ConfigurableModuleBuilder } from "@nestjs/common";
import { TokenModuleOptions } from "./token.module-options.interface";

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE
} = new ConfigurableModuleBuilder<TokenModuleOptions>()
  .setClassMethodName("forRoot")
  .setExtras(
    {
      isGlobal: true
    },
    (definition, extras) => ({
      ...definition,
      global: extras.isGlobal
    })
  )
  .build();
