import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const zRedisConfig = z.object({
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASS: z.string(),
});

export const redisEnv = zRedisConfig.parse(process.env);
