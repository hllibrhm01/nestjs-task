import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import helmet from "helmet";
import { VersioningType } from "@nestjs/common";
import { User } from "./users/entities/user.entity";
import { UsersService } from "./users/users.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    logger: ["error", "warn", "log", "debug", "verbose"]
  });

  const configService = app.get<ConfigService>(ConfigService);
  const appPort = configService.get("PORT") ?? 8080;

  const swaggerConfig = new DocumentBuilder()
    .setTitle("E-adam API")
    .addServer(`http://localhost:${appPort}`, "Local")
    .setVersion("1")
    .addBearerAuth()
    .build();

  app.use(helmet());
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: "v",
    defaultVersion: "1"
  });

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("swagger", app, document, {
    swaggerOptions: { persistAuthorization: true }
  });

  await app.init();

  await app.listen(appPort);
}

void bootstrap();
