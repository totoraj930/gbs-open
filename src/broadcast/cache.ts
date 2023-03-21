import { RaidTweetMini } from '$/redis/schema';

/**
 * 重複確認用のキャッシュ
 */
export type RaidTimeCache = {
  battleId: string;
  enemyId: number;
  time: number;
  firstTime: number;
};
export let raidTimeCache: RaidTimeCache[] = [];

export function releaseTimeCache() {
  // 30分より前のものは削除
  const threshold = Date.now() - 1000 * 60 * 30;
  raidTimeCache = raidTimeCache.filter((c) => c.time > threshold);
  return raidTimeCache;
}

/**
 * ツイート保持用のキャッシュ
 */
export type RaidTweetCache = {
  [key: number]: RaidTweetMini[];
};
export const raidCache: RaidTweetCache = {};

/**
 * 破壊的にftを付与します
 */
export function addCacheAndGrantFirstTime(tweet: RaidTweetMini) {
  // enemyIdのキャッシュが無ければ配列を作成
  if (!raidCache[tweet.ei]) raidCache[tweet.ei] = [];
  raidCache[tweet.ei].push(tweet);
  // 5件までに絞る
  raidCache[tweet.ei] = raidCache[tweet.ei].slice(-5);

  // 初回投稿時間の取得と付与
  const rcIndex = raidTimeCache.findIndex((target) => {
    return target.battleId === tweet.bi && target.enemyId === tweet.ei;
  });
  if (rcIndex < 0) {
    raidTimeCache.push({
      battleId: tweet.bi,
      enemyId: tweet.ei,
      time: tweet.t,
      firstTime: tweet.t,
    });
    tweet.ft = tweet.t;
    return tweet;
  } else {
    tweet.ft = raidTimeCache[rcIndex].firstTime;
    return tweet;
  }
}
