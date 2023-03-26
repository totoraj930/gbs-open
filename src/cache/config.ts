import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const zCacheConfig = z.object({
  CACHE_PORT: z.string(),
  GBS_LIST: z.string().url(),
});

export const cacheEnv = zCacheConfig.parse(process.env);
