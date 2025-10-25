import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UnprocessableEntityException, ValidationPipe, ValidationError } from '@nestjs/common';
import { LoggingInterceptor } from './Shared/interceptor/logging.interceptor';
import { TransformInterceptor } from './Shared/interceptor/transform.interceptor';
import { getAvailablePort } from './Shared/utils/port-checker.util';
import { envConfig } from './configs/env.config';
import * as cookieParser from 'cookie-parser';

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
  }


  ));

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.use(cookieParser());

  // Lấy port từ cấu hình
  const preferredPort = envConfig.PORT;
  const fallbackRange = envConfig.PORT_FALLBACK_RANGE;
  
  try {
    // Tìm port sẵn sàng
    const availablePort = await getAvailablePort(preferredPort, fallbackRange);
    
    console.log(`🚀 Server đang khởi động trên port ${availablePort}`);
    await app.listen(availablePort);
    
    console.log(`✅ Server đã sẵn sàng tại http://localhost:${availablePort}`);
  } catch (error) {
    console.error('❌ Không thể khởi động server:', error.message);
    process.exit(1);
  }
}
bootstrap();
