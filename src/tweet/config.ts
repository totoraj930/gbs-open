import { z } from 'zod';
import * as dotenv from 'dotenv';
dotenv.config();

export const zTweetConfig = z.object({
  BEARER: z.string(),
  OAUTH_CALLBACK: z.string().url(),
  CONSUMER_KEY: z.string(),
  CONSUMER_SECRET: z.string(),
});

export const tweetEnv = zTweetConfig.parse(process.env);
