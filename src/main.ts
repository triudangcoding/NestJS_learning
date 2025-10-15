import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { UnprocessableEntityException, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,

     exceptionFactory: (errors) => {
      return new UnprocessableEntityException(
        errors.map(e => ({
          property: e.property,
          errors: Object.values(e.constraints as any)
        }))
      )
    }
    }
  ));
  await app.listen(process.env.PORT ?? 9933);
}
bootstrap();