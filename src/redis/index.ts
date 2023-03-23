import { env } from '@/config';
import { RawRaidTweet } from '@/tweet/receiver';
import Redis, { RedisOptions } from 'ioredis';
import {
  minifyRawRaidTweet,
  RaidTweetMini,
  RawRaidTweetMini,
  unpackRawRaidTweetMini,
  zRaidTweetMini,
  zRawRaidTweetMini,
} from './schema';
import mitt from 'mitt';

export const redisOps = {
  host: env.REDIS_HOST,
  password: env.REDIS_PASS,
  port: Number.parseInt(env.REDIS_PORT),
};

type RawChEvents = {
  tweet: RawRaidTweetMini;
};
/**
 * 生のツイート受信機
 */
export function getRawChClient() {
  const receiver = mitt<RawChEvents>();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe('gbs-open-raw');
  subRedis.on('message', (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      // console.log(Date.now() - mini.t, mini.bi, `Lv.${mini.lv}`, mini.en);
      receiver.emit('tweet', mini);
    } catch {}
  });
  return receiver;
}

type RaidTweetChEvents = {
  tweet: RaidTweetMini;
};
/**
 * 完成済みのツイート受信機
 */
export function getRaidTweetChClient() {
  const receiver = mitt<RaidTweetChEvents>();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe('gbs-open-tweet');
  subRedis.on('message', (ch, json) => {
    try {
      const mini = zRaidTweetMini.parse(JSON.parse(json));
      receiver.emit('tweet', mini);
    } catch {}
  });
  return receiver;
}

/**
 * 送信用Redisクライアント
 */
const pubRedis = new Redis(redisOps);

/**
 * 生のツイートデータを送信
 */
export function sendRawRaidTweet(tweet: RawRaidTweet) {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish('gbs-open-raw', json);
}

/**
 * 加工済みのツイートデータを送信
 */
export function sendRaidTweet(tweet: RaidTweetMini) {
  const json = JSON.stringify(tweet);
  pubRedis.publish('gbs-open-tweet', json);
}
