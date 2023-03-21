import { env } from '$/config';
import mitt from 'mitt';
import { parse, GbfTweet } from '@totoraj930/gbf-tweet-parser';
import Twitter from 'twitter-lite';
import { getActiveTokenMany, toggleActiveFromTwitterId } from '$/db';
import {
  currentQuery,
  parseRateLimitHeaders,
  zRateLimitStatusRes,
  zSearchTweetsRes,
} from './schema';

const twitOps = {
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
};

type ReceiverEvents = {
  tweet: RaidTweet;
};

export const tweetReciver = mitt<ReceiverEvents>();

type Client = {
  twitterId: string;
  twit: Twitter;
  limit: number; // 多いほど優先
  resetTime: number;
};
export type RaidTweet = {
  name: string;
  screen_name: string;
  user_id: number;
  battle_id: string;
  comment?: string;
  enemy_name: string;
  level: string;
  language: 'ja' | 'en';
  time: number;
};

let clientList: Client[] = [];
let since_id = 0;
let startFlag = false;
let timer: NodeJS.Timeout | null = null;

/**
 * インターバル時間を計算する
 */
export function getIntervalTime() {
  let sumLimit = 0;
  let sumTime = 0;
  const now = Date.now();
  for (const c of clientList) {
    sumLimit += c.limit;
    sumTime += c.resetTime - now;
  }
  return Math.max(sumTime / sumLimit / clientList.length, 500);
}

/**
 * 低いほど優先
 */
function getScore(client: Client) {
  return (client.resetTime - Date.now()) / client.limit;
}

/**
 * 使用するクライアントを取得する
 */
export function getCurrentClient() {
  clientList
    .sort((a, b) => getScore(a) - getScore(b))
    .sort((a, b) => b.limit - a.limit);

  return clientList[0];
}

export function start() {
  if (timer) clearTimeout(timer);
  startFlag = true;
  task();
}

export function stop() {
  if (timer) clearTimeout(timer);
  startFlag = false;
}

export async function task() {
  try {
    const res = await getTweet();
    for (let i = res.length - 1; i >= 0; i--) {
      tweetReciver.emit('tweet', res[i]);
    }
  } catch {
    /* */
  }
  if (startFlag) {
    const intervalTime = getIntervalTime();
    console.log(new Date().toLocaleString(), intervalTime);
    timer = setTimeout(task, intervalTime);
  }
}

/**
 * ツイ救援ツイートを検索する
 */
export async function getTweet() {
  const client = getCurrentClient();
  const q = currentQuery();
  console.log(client.twitterId);
  const twitRes = await client.twit.get('search/tweets', {
    q,
    since_id,
    count: 30,
    result_type: 'recent',
    include_entities: false,
  });
  const i = clientList.findIndex((v) => v.twitterId === client.twitterId);
  clientList[i] = {
    ...client,
    ...parseRateLimitHeaders(twitRes),
  };

  const res = zSearchTweetsRes.parse(twitRes);

  since_id = res.statuses[0]?.id ?? since_id;
  return res.statuses
    .map((tweet): RaidTweet | null => {
      const gbsTweet = parse(tweet.text);
      if (gbsTweet) {
        return {
          name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          user_id: tweet.user.id,
          battle_id: gbsTweet.battleId,
          enemy_name: gbsTweet.enemyName,
          level: gbsTweet.level,
          language: gbsTweet.language,
          time: new Date(tweet.created_at).getTime(),
        };
      }
      return null;
    })
    .flatMap((v) => (v === null ? [] : [v]));
}

/**
 * クライアントを初期化
 */
export async function initClientList() {
  const users = await getActiveTokenMany();
  clientList = users.map((user) => {
    return {
      twit: new Twitter({
        ...twitOps,
        access_token_key: user.oauthToken!,
        access_token_secret: user.oauthTokenSecret!,
      }),
      twitterId: user.twitterId,
      limit: 0,
      resetTime: Date.now() + 1000 * 60 * 60,
      score: 0,
    };
  });
  const promises = await Promise.all(
    clientList.map(async (item) => {
      try {
        const twitRes = await item.twit.get('application/rate_limit_status', {
          resources: 'search',
        });
        const res = zRateLimitStatusRes.parse(twitRes);
        const s = res.resources.search['/search/tweets'];
        const resetTime = s.reset * 1000;
        return {
          ...item,
          limit: s.remaining,
          resetTime,
        };
      } catch (err) {
        // @ts-ignore
        if (err?.errors?.[0]?.code === 215) {
          await toggleActiveFromTwitterId(item.twitterId, false);
        }
        return null;
      }
    })
  );
  clientList = promises.flatMap((item) => (item === null ? [] : [item]));
}
