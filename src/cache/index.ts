import { env } from '$/config';
import { getRawChClient, sendRaidTweet } from '$/redis';
import { RaidTweetMini, RawRaidTweetMini } from '$/redis/schema';
import { addCacheAndGrantFirstTime, releaseTimeCache } from './cache';
import { getEnemyId, initGbsList } from './gbsList';
import { server } from './server';
import { getTimestamp } from '$/tweet/schema';

async function main() {
  await initGbsList();
  console.log(getTimestamp(), '✅ initGbsList()');
  server.listen(Number.parseInt(env.CACHE_PORT));

  server.on('listening', () => {
    console.log(getTimestamp(), `🚀 listening... :${env.CACHE_PORT}`);
  });

  const subRedis = getRawChClient();
  subRedis.on('tweet', (raw) => {
    const mini = createRaidTweetMini(raw);
    sendRaidTweet(mini);
  });

  // 不要なキャッシュを削除
  setInterval(() => {
    releaseTimeCache();
  }, 1000 * 60);
}

function createRaidTweetMini(raw: RawRaidTweetMini): RaidTweetMini {
  const { en, lv, ...props } = raw;
  const enemyId = getEnemyId(en, lv);
  const res: RaidTweetMini = {
    ...props,
    ei: enemyId,
    ft: raw.t,
  };
  addCacheAndGrantFirstTime(res);
  return res;
}

main();
