import { redisEnv } from './config';
import { RawRaidTweet } from '@/tweet/receiver';
import Redis from 'ioredis';
import {
  minifyRawRaidTweet,
  RaidTweetMini,
  RawRaidTweetMini,
  zRaidTweetMini,
  zRawRaidTweetMini,
} from './schema';
import mitt from 'mitt';

export const redisOps = {
  host: redisEnv.REDIS_HOST,
  password: redisEnv.REDIS_PASS,
  port: Number.parseInt(redisEnv.REDIS_PORT),
};

type RawChEvents = {
  tweet: RawRaidTweetMini;
  updateGbsList: void;
};
/**
 * 生のツイート受信機
 */
export function getRawChClient(chName = 'gbs-open-raw') {
  const receiver = mitt<RawChEvents>();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe(chName);
  subRedis.on('message', (ch, json) => {
    try {
      const mini = zRawRaidTweetMini.parse(JSON.parse(json));
      // console.log(Date.now() - mini.t, mini.bi, `Lv.${mini.lv}`, mini.en);
      receiver.emit('tweet', mini);
    } catch {
      if (json === 'updateGbsList') {
        receiver.emit('updateGbsList');
      }
    }
  });
  return receiver;
}

type RaidTweetChEvents = {
  tweet: RaidTweetMini;
  updateGbsList: void;
};
/**
 * 完成済みのツイート受信機
 */
export function getRaidTweetChClient(chName = 'gbs-open-tweet') {
  const receiver = mitt<RaidTweetChEvents>();
  const subRedis = new Redis(redisOps);
  subRedis.subscribe(chName);
  subRedis.on('message', (ch, json) => {
    try {
      const mini = zRaidTweetMini.parse(JSON.parse(json));
      receiver.emit('tweet', mini);
    } catch {
      if (json === 'updateGbsList') {
        receiver.emit('updateGbsList');
      }
    }
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
export function sendRawRaidTweet(tweet: RawRaidTweet, chName = 'gbs-open-raw') {
  const mini = minifyRawRaidTweet(tweet);
  const json = JSON.stringify(mini);
  pubRedis.publish(chName, json);
}

/**
 * 加工済みのツイートデータを送信
 */
export function sendRaidTweet(tweet: RaidTweetMini, chName = 'gbs-open-tweet') {
  const json = JSON.stringify(tweet);
  pubRedis.publish(chName, json);
}
