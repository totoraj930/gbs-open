import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

const schema = z.object({
  OAUTH_CALLBACK: z.string().url(),
  // CLIENT_ID: z.string(),
  // CLIENT_SECRET: z.string(),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
  PORT: z.string(),

  CACHE_PORT: z.string(),
  STREAM_PORT: z.string(),

  GBS_LIST: z.string().url(),

  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASS: z.string(),
});

export const env = schema.parse(process.env);
