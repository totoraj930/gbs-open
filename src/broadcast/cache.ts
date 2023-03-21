import { RaidTweetMini } from '$/redis/schema';

/**
 * 重複確認用のキャッシュ
 */
export type RaidTweetCache = {
  battleId: string;
  enemyId: number;
  time: number;
  firstTime: number;
};
export let raidCache: RaidTweetCache[] = [];

export function releaseCache() {
  // 30分より前のものは削除
  const threshold = Date.now() - 1000 * 60 * 30;
  raidCache = raidCache.filter((c) => c.time > threshold);
  return raidCache;
}

/**
 * 破壊的にftを付与します
 */
export function addCacheAndGrantFirstTime(tweet: RaidTweetMini) {
  const rcIndex = raidCache.findIndex((target) => {
    return target.battleId === tweet.bi && target.enemyId === tweet.ei;
  });
  if (rcIndex < 0) {
    raidCache.push({
      battleId: tweet.bi,
      enemyId: tweet.ei,
      time: tweet.t,
      firstTime: tweet.t,
    });
    tweet.ft = tweet.t;
    return tweet;
  } else {
    tweet.ft = raidCache[rcIndex].firstTime;
    return tweet;
  }
}
