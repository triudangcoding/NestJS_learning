import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe, ValidationError } from '@nestjs/common';

function flattenValidationErrors(errors: ValidationError[], parent = ''): { property: string; errors: string[] }[] {
  const out: { property: string; errors: string[] }[] = [];
  for (const e of errors) {
    const path = parent ? `${parent}.${e.property}` : e.property;
    if (e.constraints) out.push({ property: path, errors: Object.values(e.constraints) });
    if (e.children?.length) out.push(...flattenValidationErrors(e.children, path));
  }
  return out;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    stopAtFirstError: false,
    validationError: { target: false, value: false },
    transformOptions: { enableImplicitConversion: true },
    exceptionFactory: (errors: ValidationError[]) => {
      return new UnprocessableEntityException({
        statusCode: 422,
        message: 'Validation failed',
        errors: flattenValidationErrors(errors),
      });
    },
  }));

  await app.listen(process.env.PORT ?? 9933);
}
bootstrap();
