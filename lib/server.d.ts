import * as mitt from 'mitt';
import { z } from 'zod';

type RawRaidTweet = {
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

/**
 * Redis送信用の文字数を抑えたRaidTweet
 */
declare const zRawRaidTweetMini: z.ZodObject<{
    n: z.ZodString;
    sn: z.ZodString;
    en: z.ZodString;
    ui: z.ZodNumber;
    ti: z.ZodNumber;
    bi: z.ZodString;
    lv: z.ZodString;
    l: z.ZodEnum<["en", "ja"]>;
    t: z.ZodNumber;
    c: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    en: string;
    n: string;
    sn: string;
    ui: number;
    ti: number;
    bi: string;
    lv: string;
    l: "ja" | "en";
    t: number;
    c?: string | undefined;
}, {
    en: string;
    n: string;
    sn: string;
    ui: number;
    ti: number;
    bi: string;
    lv: string;
    l: "ja" | "en";
    t: number;
    c?: string | undefined;
}>;
type RawRaidTweetMini = z.infer<typeof zRawRaidTweetMini>;
declare function minifyRawRaidTweet(tweet: RawRaidTweet): RawRaidTweetMini;
declare function unpackRawRaidTweetMini(mini: RawRaidTweetMini): RawRaidTweet;
/**
 * 実際に配信されるツイートデータ
 */
declare const zRaidTweetMini: z.ZodObject<{
    n: z.ZodString;
    sn: z.ZodString;
    ui: z.ZodNumber;
    ti: z.ZodNumber;
    bi: z.ZodString;
    ei: z.ZodNumber;
    lv: z.ZodOptional<z.ZodString>;
    en: z.ZodOptional<z.ZodString>;
    l: z.ZodEnum<["en", "ja"]>;
    t: z.ZodNumber;
    ft: z.ZodNumber;
    c: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    n: string;
    sn: string;
    ui: number;
    ti: number;
    bi: string;
    l: "ja" | "en";
    t: number;
    ei: number;
    ft: number;
    lv?: string | undefined;
    en?: string | undefined;
    c?: string | undefined;
}, {
    n: string;
    sn: string;
    ui: number;
    ti: number;
    bi: string;
    l: "ja" | "en";
    t: number;
    ei: number;
    ft: number;
    lv?: string | undefined;
    en?: string | undefined;
    c?: string | undefined;
}>;
type RaidTweetMini = z.infer<typeof zRaidTweetMini>;

declare const redisOps: {
    host: string;
    password: string;
    port: number;
};
type RawChEvents = {
    tweet: RawRaidTweetMini;
};
/**
 * 生のツイート受信機
 */
declare function getRawChClient(): mitt.Emitter<RawChEvents>;
type RaidTweetChEvents = {
    tweet: RaidTweetMini;
};
/**
 * 完成済みのツイート受信機
 */
declare function getRaidTweetChClient(): mitt.Emitter<RaidTweetChEvents>;
/**
 * 生のツイートデータを送信
 */
declare function sendRawRaidTweet(tweet: RawRaidTweet): void;
/**
 * 加工済みのツイートデータを送信
 */
declare function sendRaidTweet(tweet: RaidTweetMini): void;

declare const zConfig: z.ZodObject<{
    OAUTH_CALLBACK: z.ZodString;
    CONSUMER_KEY: z.ZodString;
    CONSUMER_SECRET: z.ZodString;
    PORT: z.ZodString;
    CACHE_PORT: z.ZodString;
    STREAM_PORT: z.ZodString;
    GBS_LIST: z.ZodString;
    REDIS_HOST: z.ZodString;
    REDIS_PORT: z.ZodString;
    REDIS_PASS: z.ZodString;
}, "strip", z.ZodTypeAny, {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
}, {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
}>;
declare const env: {
    OAUTH_CALLBACK: string;
    CONSUMER_KEY: string;
    CONSUMER_SECRET: string;
    PORT: string;
    CACHE_PORT: string;
    STREAM_PORT: string;
    GBS_LIST: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_PASS: string;
};

export { RaidTweetMini, RawRaidTweet, RawRaidTweetMini, env, getRaidTweetChClient, getRawChClient, minifyRawRaidTweet, redisOps, sendRaidTweet, sendRawRaidTweet, unpackRawRaidTweetMini, zConfig, zRaidTweetMini, zRawRaidTweetMini };
