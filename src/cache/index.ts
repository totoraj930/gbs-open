import { env } from '@/config';
import { getRawChClient, sendRaidTweet } from '@/redis';
import { RaidTweetMini, RawRaidTweetMini } from '@/redis/schema';
import { addCacheAndGrantFirstTime, releaseTimeCache } from './cache';
import { getEnemyId, initGbsList } from '@/gbsList';
import { server } from './server';

async function main() {
  await initGbsList(env.GBS_LIST);
  console.log('✅ initGbsList()');
  server.listen(Number.parseInt(env.CACHE_PORT));

  server.on('listening', () => {
    console.log(`🚀 listening... :${env.CACHE_PORT}`);
  });

  const subRedis = getRawChClient();
  subRedis.on('tweet', (raw) => {
    const mini = createRaidTweetMini(raw);
    if (mini) {
      sendRaidTweet(mini);
    }
  });

  // 不要なキャッシュを削除
  setInterval(() => {
    releaseTimeCache();
  }, 1000 * 60);
}

function createRaidTweetMini(raw: RawRaidTweetMini): RaidTweetMini | null {
  const { en, lv, ...props } = raw;
  const enemyId = getEnemyId(en, lv);
  const temp: RaidTweetMini = {
    ...props,
    ei: enemyId,
    ft: raw.t,
  };
  if (enemyId === -1) {
    temp.en = en;
    temp.lv = lv;
  }
  return addCacheAndGrantFirstTime(temp);
}

main();
