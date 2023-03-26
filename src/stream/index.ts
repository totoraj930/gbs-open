import { streamEnv } from './config';
import { getRaidTweetChClient } from '@/redis';
import { sendToAll } from './wss/all';
import { server } from './server';

/**
 * WebSocketで全救援を配信するサーバー
 */

async function main() {
  server.listen(Number.parseInt(streamEnv.STREAM_PORT));

  server.on('listening', () => {
    console.log(`🚀 listening... :${streamEnv.STREAM_PORT}`);
  });

  const subRedis = getRaidTweetChClient();
  subRedis.on('tweet', (mini) => {
    sendToAll({
      type: 't',
      data: mini,
    });
  });
}

main();
