import { RawRaidTweet } from '@/tweet/receiver';
import { z } from 'zod';

/**
 * Redis送信用の文字数を抑えたRaidTweet
 */
export const zRawRaidTweetMini = z.object({
  n: z.string(), // name
  sn: z.string(), // screen_name
  en: z.string(), // enemy_name
  ui: z.string(), // user_id
  ti: z.string(), // tweet_id
  bi: z.string(), // battle_id
  lv: z.string(), // level
  l: z.enum(['en', 'ja']), // language
  t: z.number(), // time
  et: z.number(), // elapsed_time
  c: z.string().optional(), // comment
});

/**
 * 対応\
 * n: name\
 * sn: scree_name\
 * en: enemy_name\
 * ui: user_id\
 * ti: tweet_id\
 * bi: battle_id\
 * lv: level\
 * l: language\
 * t: time\
 * et: elapsed_time\
 * c: comment
 */
export type RawRaidTweetMini = z.infer<typeof zRawRaidTweetMini>;

export function minifyRawRaidTweet(tweet: RawRaidTweet): RawRaidTweetMini {
  return {
    n: tweet.name,
    sn: tweet.screen_name,
    en: tweet.enemy_name,
    ui: tweet.user_id,
    ti: tweet.tweet_id,
    bi: tweet.battle_id,
    lv: tweet.level,
    l: tweet.language,
    t: tweet.time,
    et: tweet.elapsed_time,
    c: tweet.comment,
  };
}

export function unpackRawRaidTweetMini(mini: RawRaidTweetMini): RawRaidTweet {
  return {
    name: mini.n,
    screen_name: mini.sn,
    enemy_name: mini.en,
    user_id: mini.ui,
    tweet_id: mini.ti,
    battle_id: mini.bi,
    level: mini.lv,
    language: mini.l,
    time: mini.t,
    comment: mini.c,
    elapsed_time: mini.et,
  };
}

/**
 * 実際に配信されるツイートデータ
 */
export const zRaidTweetMini = z.object({
  n: z.string(), // name
  sn: z.string(), // screen_name
  ui: z.string(), // user_id
  ti: z.string(), // tweet_id
  bi: z.string(), // battle_id
  ei: z.number(), // enemy_id(-1はリスト外)
  lv: z.string().optional(), // level
  en: z.string().optional(), // enemy_name
  l: z.enum(['en', 'ja']), // language
  t: z.number(), // time
  et: z.number(), // elapsed_time
  ft: z.number(), // first time(初回投稿時間)
  c: z.string().optional(), // comment
});

/**
 * 対応\
 * n: name\
 * sn: scree_name\
 * ui: user_id\
 * ti: tweet_id\
 * bi: battle_id\
 * ei: enemy_id(-1はリスト外)\
 * l: language\
 * t: time\
 * ft: first_time(初回投稿時間\
 * c: comment\
 * リスト外のみ追加\
 * en?: enemy_name\
 * lv?: level
 */
export type RaidTweetMini = z.infer<typeof zRaidTweetMini>;
