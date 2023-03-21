import { env } from '$/config';
import mitt from 'mitt';
import { parse } from '@totoraj930/gbf-tweet-parser';
import { TwitterApi } from 'twitter-api-v2';
import { getActiveTokenMany, deleteOAuthField } from '$/db';
import {
  getSearchParam,
  getTimestamp,
  isErrorV1,
  v1SearchTweets,
} from './schema';

type ReceiverEvents = {
  tweet: RaidTweet;
};

export const tweetReceiver = mitt<ReceiverEvents>();

export type RaidTweet = {
  name: string;
  screen_name: string;
  user_id: number;
  tweet_id: number;
  battle_id: string;
  comment?: string;
  enemy_name: string;
  level: string;
  language: 'ja' | 'en';
  time: number;
};

type Client = {
  twitterId: string;
  twit: TwitterApi;
  limit: number; // 多いほど優先
  resetTime: number;
  count: number; // 現在までの使用回数
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
  const userNum = clientList.length;
  // 各ユーザーの最大使用回数を50回としたときの最小ms
  const limit50 = (1000 * 60 * 15) / (50 * userNum);
  return Math.max(500, Math.max(limit50, sumTime / sumLimit / userNum));
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

/**
 * インターバルごとに実行される
 */
export async function task() {
  let res = null;
  try {
    res = await getTweet();
  } catch {}
  if (res === null) {
    if (startFlag) {
      timer = setTimeout(task, 1);
    }
    return;
  }
  for (let i = res.length - 1; i >= 0; i--) {
    tweetReceiver.emit('tweet', res[i]);
  }
  if (startFlag) {
    const intervalTime = getIntervalTime();
    console.log(getTimestamp(), intervalTime);
    timer = setTimeout(task, intervalTime);
  }
}

/**
 * 低いほど優先
 */
function getScore(client: Client) {
  return (client.resetTime - Date.now()) / client.limit;
}

/**
 * 使用するクライアントを決める
 */
export function getCurrentClient() {
  const nowTime = Date.now();
  for (const c of clientList) {
    // 使用回数が0回なら最優先
    if (c.count === 0) return c;
    // レート制限更新時間を過ぎているなら優先
    if (c.resetTime < nowTime) return c;
  }
  // 1. レート制限までの回数に余裕がある
  // 2. 使用できる間隔がより短い
  clientList
    .sort((a, b) => getScore(a) - getScore(b))
    .sort((a, b) => b.limit - a.limit);

  return clientList[0];
}

/**
 * ツイ救援ツイートを検索する
 */
export async function getTweet(): Promise<RaidTweet[] | null> {
  const client = getCurrentClient();
  const cIndex = clientList.indexOf(client);
  console.log(
    getTimestamp(),
    client.twitterId,
    'count:' + client.count,
    'limit:' + client.limit
  );

  try {
    const twitRes = await v1SearchTweets(client.twit, getSearchParam(since_id));

    // クライアントの情報更新
    clientList[cIndex].limit = twitRes.rateLimit?.remaining ?? 0;
    clientList[cIndex].resetTime =
      (twitRes.rateLimit?.reset ?? Date.now() / 1000) * 1000;
    clientList[cIndex].count++;

    return twitRes.data.statuses.flatMap((tweet): RaidTweet[] => {
      const gbsTweet = parse(tweet.text);
      if (!gbsTweet) return [];

      return [
        {
          battle_id: gbsTweet.battleId,
          enemy_name: gbsTweet.enemyName,
          language: gbsTweet.language,
          level: gbsTweet.level,
          name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          user_id: tweet.user.id,
          tweet_id: tweet.id,
          time: new Date(tweet.user.created_at).getTime(),
          comment: gbsTweet.comment,
        },
      ];
    });
  } catch (err) {
    const errors = TwitterApi.getErrors(err);
    for (const e of errors) {
      if (isErrorV1(e)) {
        if (e.code === 89) {
          // 'Invalid or expired token.'
          await disableClient(cIndex);
        }
        console.error(getTimestamp(), e);
      }
    }
    return null;
  }
}

/**
 * クライアントを無効にする
 */
export async function disableClient(index: number) {
  const client = clientList[index];
  if (!client) return false;
  // clientListから削除
  clientList.splice(index, 1);
  // DBを更新
  await deleteOAuthField(client.twitterId);
  return true;
}

/**
 * クライアントを初期化
 */
export async function initClientList() {
  const users = await getActiveTokenMany();
  clientList = users.map((user) => {
    return {
      twit: new TwitterApi({
        appKey: env.CONSUMER_KEY,
        appSecret: env.CONSUMER_SECRET,
        accessToken: user.oauthToken!,
        accessSecret: user.oauthTokenSecret!,
      }),
      twitterId: user.twitterId,
      // 最大値を初期値にする
      limit: 180,
      resetTime: Date.now() + 1000 * 60 * 15,
      count: 0,
    };
  });
}
