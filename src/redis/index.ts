import { env } from '$/config';
import { RaidTweet } from '$/tweet/receiver';
import Redis, { RedisOptions } from 'ioredis';
import { minifyRaidTweet } from './schema';

const redisOps: RedisOptions = {
  host: env.REDIS_HOST,
  password: env.REDIS_PASS,
  port: Number.parseInt(env.REDIS_PORT),
};

/**
 * 送信用Redisクライアント
 */
const pubRedis = new Redis(redisOps);

export function sendRawRaidTweet(tweet: RaidTweet) {
  const mini = minifyRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish('gbs-open-raw', json);
}
