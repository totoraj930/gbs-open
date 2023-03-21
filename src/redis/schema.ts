import { RaidTweet } from '$/tweet/receiver';
import { z } from 'zod';

/**
 * Redis送信用の文字数を抑えたRaidTweet
 */
export const zRaidTweetMini = z.object({
  n: z.string(), // name
  sn: z.string(), // screen_name
  en: z.string(), // enemy_name
  ui: z.number(), // user_id
  ti: z.number(), // tweet_id
  bi: z.string(), // battle_id
  lv: z.string(), // level
  l: z.enum(['en', 'ja']), // language
  t: z.number(), // time
  c: z.string().optional(), // comment
});
export type RaidTweetMini = z.infer<typeof zRaidTweetMini>;

export function minifyRaidTweet(tweet: RaidTweet): RaidTweetMini {
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
    c: tweet.comment,
  };
}

export function unpackRaidTweetMini(mini: RaidTweetMini): RaidTweet {
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
  };
}
