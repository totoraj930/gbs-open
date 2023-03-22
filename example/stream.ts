import { zRaidTweetMini } from '$/redis/schema';
import { WebSocket } from 'ws';
import { z } from 'zod';

const zTweetMessage = z.object({
  type: z.literal('t'),
  data: zRaidTweetMini,
});
const zTimeMessage = z.object({
  type: z.literal('time'),
  data: z.number(),
});

const zMessage = z.union([zTweetMessage, zTimeMessage]);

async function main() {
  // const ws = new WebSocket('ws://localhost:10502/all');
  const ws = new WebSocket('wss://gbs-open.eriri.net/api/stream/all');
  ws.on('open', () => {
    console.log('✅ open');
  });
  ws.on('message', (rawMsg) => {
    try {
      const msg = zMessage.parse(JSON.parse(rawMsg.toString('utf-8')));
      console.log(msg);
    } catch {}
  });
}

main();
