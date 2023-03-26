import * as dotenv from 'dotenv';
import { zCacheConfig } from './cache/config';
import { zSiteConfig } from './site/config';
import { zRedisConfig } from './redis/config';
import { zTweetConfig } from './tweet/config';
import { zStreamConfig } from './stream/config';
dotenv.config();

export const zAllConfig = zCacheConfig
  .merge(zSiteConfig)
  .merge(zRedisConfig)
  .merge(zTweetConfig)
  .merge(zStreamConfig);

export const allEnv = zAllConfig.parse(process.env);
