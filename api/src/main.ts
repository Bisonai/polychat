import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "./app.module";

export function createSwaggerDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle("Polygon PolyChat Private Api")
    .setDescription("Polygon PolyChat Api")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  return SwaggerModule.createDocument(app, config);
}

async function bootstrap() {
  // @ts-ignore
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  SwaggerModule.setup("swagger", app, createSwaggerDocument(app), {
    customSiteTitle: "Polygon PolyChat",
  });
  await app.listen(8888, "0.0.0.0");
}

bootstrap();
