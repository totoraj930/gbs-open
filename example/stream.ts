import { gbsList, initGbsList } from '../lib';
import { RaidTweetMini, zRaidTweetMini } from '../lib';
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

/**
 * ツイートを受信したらコンソールに出力する
 */
function onTweet(tweet: RaidTweetMini) {
  // リストから敵情報を取得
  const enemy = gbsList.find((item) => item.id === tweet.ei);

  if (!enemy) {
    // リスト外
    console.log(
      tweet.bi,
      'Lv.' + (tweet.lv ?? '???'),
      tweet.en,
      '@' + tweet.sn
    );
  } else {
    // リスト内
    console.log(tweet.bi, 'Lv.' + enemy.level, enemy.ja, '@' + tweet.sn);
  }
}

async function main() {
  // 敵の情報リストの初期化
  await initGbsList('https://gbs.eriri.net/list');

  // WebSocketに接続
  // const ws = new WebSocket('ws://localhost:10502/all');
  const ws = new WebSocket('wss://gbs-open.eriri.net/api/stream/all');
  ws.on('open', () => {
    console.log('✅ open');
  });
  ws.on('message', (rawMsg) => {
    try {
      const msg = zMessage.parse(JSON.parse(rawMsg.toString('utf-8')));
      if (msg.type === 't') {
        // ツイート
        onTweet(msg.data);
      } else {
        // それ以外のメッセージ
        console.log(msg);
      }
    } catch {}
  });
}

main();
