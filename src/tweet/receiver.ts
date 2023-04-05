import { tweetEnv } from './config';
import mitt from 'mitt';
import { parse } from '@totoraj930/gbf-tweet-parser';
import { TwitterApi } from 'twitter-api-v2';
import { getActiveTokenMany, deleteOAuthField } from '@/db';
import { getSearchParam, isErrorV1, v1SearchTweets } from './schema';

type ReceiverEvents = {
  tweet: RawRaidTweet;
};

export const tweetReceiver = mitt<ReceiverEvents>();

export type RawRaidTweet = {
  name: string;
  screen_name: string;
  user_id: string;
  tweet_id: string;
  battle_id: string;
  comment?: string;
  enemy_name: string;
  level: string;
  language: 'ja' | 'en';
  time: number;
  elapsed_time: number;
};

type Client = {
  twitterId: string;
  twit: TwitterApi;
  limit: number; // 多いほど優先
  resetTime: number;
  count: number; // 現在までの使用回数
};

let clientList: Client[] = [];
let since_id = '0';
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
  const userNum = clientList.filter((c) => c.limit > 0).length;
  // 各ユーザーの最大使用回数を50回としたときの最小ms
  const limit50 = (1000 * 60 * 15) / (50 * userNum);
  return Math.max(400, Math.max(limit50, sumTime / sumLimit / userNum));
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
    console.log(intervalTime);
    timer = setTimeout(task, intervalTime);
  }
}

/**
 * 低いほど優先
 */
function getScore(client: Client) {
  return (client.resetTime - Date.now()) / Math.max(client.limit, 1);
}

/**
 * 使用するクライアントを決める
 */
export function getCurrentClient() {
  const nowTime = Date.now();
  // limitが0は弾く
  const aliveClient = clientList.filter((c) => c.limit > 0);
  for (const c of aliveClient) {
    // 使用回数が0回なら最優先
    // if (c.count === 0) return c;
    // レート制限更新時間を過ぎているなら優先
    // if (c.resetTime < nowTime) return c;
  }
  // 1. レート制限までの回数に余裕がある
  // 2. 使用できる間隔がより短い
  aliveClient
    .sort((a, b) => getScore(a) - getScore(b))
    .sort((a, b) => b.limit - a.limit);

  return aliveClient[0];
}

/**
 * ツイ救援ツイートを検索する
 */
export async function getTweet(): Promise<RawRaidTweet[] | null> {
  const client = getCurrentClient();
  const cIndex = clientList.indexOf(client);
  console.log(
    '<-',
    client.twitterId,
    'count:' + client.count,
    'limit:' + client.limit
  );

  try {
    const twitRes = await v1SearchTweets(client.twit, getSearchParam(since_id));

    since_id = twitRes.data.search_metadata.max_id_str;
    // const serverTime = new Date(twitRes.headers.date ?? Date.now()).getTime();
    const serverTime = Date.now();

    // クライアントの情報更新
    clientList[cIndex].limit = twitRes.rateLimit?.remaining ?? 0;
    clientList[cIndex].resetTime =
      (twitRes.rateLimit?.reset ?? Date.now() / 1000) * 1000;
    clientList[cIndex].count++;
    console.log(
      '->',
      client.twitterId,
      'count:' + client.count,
      'limit:' + client.limit
    );

    return twitRes.data.statuses.flatMap((tweet): RawRaidTweet[] => {
      const gbsTweet = parse(tweet.text);
      if (!gbsTweet) return [];
      const tweetTime = new Date(tweet.created_at).getTime();

      return [
        {
          battle_id: gbsTweet.battleId,
          enemy_name: gbsTweet.enemyName,
          language: gbsTweet.language,
          level: gbsTweet.level,
          name: tweet.user.name,
          screen_name: tweet.user.screen_name,
          user_id: tweet.user.id_str,
          tweet_id: tweet.id_str,
          time: tweetTime,
          comment: gbsTweet.comment,
          elapsed_time: serverTime - tweetTime,
        },
      ];
    });
  } catch (err) {
    const errors = TwitterApi.getErrors(err);
    // ひとまず全部0にする
    clientList[cIndex].count++;
    clientList[cIndex].limit = 0;
    for (const e of errors) {
      if (isErrorV1(e)) {
        if (e.code === 89 || e.code === 326) {
          // 89 'Invalid or expired token.'
          // 326 'To protect our users from spam and other malicious activity, this account is temporarily locked. Please log in to https://twitter.com to unlock your account.'
          await disableClient(cIndex);
        } else if (e.code === 88) {
          // Rate limit exceeded
          // client.limit = 0;
        }
        console.error(
          client.twitterId,
          'limit:' + client.limit,
          'count:' + client.count,
          e
        );
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
        appKey: tweetEnv.CONSUMER_KEY,
        appSecret: tweetEnv.CONSUMER_SECRET,
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
