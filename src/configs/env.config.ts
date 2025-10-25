import { plainToInstance } from 'class-transformer';
import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator';
import 'dotenv/config';

class ConfigSchema {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  @IsOptional()
  PORT: number;

  @IsNumber()
  @IsOptional()
  PORT_FALLBACK_RANGE: number;

  @IsString()
  ACCESS_TOKEN_SECRET: string;

  @IsString()
  ACCESS_TOKEN_EXPIRES_IN: string;

  @IsString()
  REFRESH_TOKEN_SECRET: string;

  @IsString()
  REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  NODE_ENV: string;

  @IsString()
  API_SECRET_KEY: string;
}

// Validate environment variables
const configServer = plainToInstance(ConfigSchema, {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: parseInt(process.env.PORT ?? '9934', 10),
  PORT_FALLBACK_RANGE: parseInt(process.env.PORT_FALLBACK_RANGE ?? '100', 10),
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  NODE_ENV: process.env.NODE_ENV,
  API_SECRET_KEY: process.env.API_SECRET_KEY,
}, {
  enableImplicitConversion: true,
});

const errorsArray = validateSync(configServer);

if (errorsArray.length > 0) {
  const errorMessages = errorsArray.map((error) => {
    return `${error.property}: ${Object.values(error.constraints || {}).join(', ')}`;
  }).join('; ');
  
  throw new Error(`Invalid environment variables: ${errorMessages}`);
}

// Export validated configuration
export const envConfig = {
  DATABASE_URL: configServer.DATABASE_URL,
  PORT: configServer.PORT,
  PORT_FALLBACK_RANGE: configServer.PORT_FALLBACK_RANGE,
  ACCESS_TOKEN_SECRET: configServer.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRES_IN: configServer.ACCESS_TOKEN_EXPIRES_IN ?? '1h',
  REFRESH_TOKEN_SECRET: configServer.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN: configServer.REFRESH_TOKEN_EXPIRES_IN ?? '7d',
  NODE_ENV: configServer.NODE_ENV ?? 'development',
  API_SECRET_KEY: configServer.API_SECRET_KEY,
};

export default envConfig;