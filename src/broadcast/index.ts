import { env } from '$/config';
import { getRawChClient, sendRaidTweet } from '$/redis';
import { RaidTweetMini, RawRaidTweetMini } from '$/redis/schema';
import { addCacheAndGrantFirstTime } from './cache';
import { getEnemyId, initGbsList } from './gbsList';

async function main() {
  await initGbsList();
  const subRedis = getRawChClient();
  subRedis.on('tweet', (raw) => {
    const mini = createRaidTweetMini(raw);
    sendRaidTweet(mini);
  });
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
