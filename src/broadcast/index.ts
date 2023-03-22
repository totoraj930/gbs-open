import { env } from '$/config';
import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { getRawChClient, sendRaidTweet } from '$/redis';
import { RaidTweetMini, RawRaidTweetMini } from '$/redis/schema';
import { addCacheAndGrantFirstTime, releaseTimeCache } from './cache';
import { getEnemyId, initGbsList } from './gbsList';
import { sendToAll } from './wss/all';
import { server } from './server';
import { getTimestamp } from '$/tweet/schema';

async function main() {
  await initGbsList();
  console.log(getTimestamp(), '✅ initGbsList()');
  server.listen(Number.parseInt(env.BC_PORT));

  server.on('listening', () => {
    console.log(getTimestamp(), `🚀 listening... :${env.BC_PORT}`);
  });

  const subRedis = getRawChClient();
  subRedis.on('tweet', (raw) => {
    const mini = createRaidTweetMini(raw);
    sendRaidTweet(mini);
    sendToAll({
      type: 't',
      data: mini,
    });
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
