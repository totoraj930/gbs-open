import { sendRawRaidTweet } from '$/redis';
import { initClientList, start, tweetReceiver } from './receiver';

async function main() {
  await initClientList();
  tweetReceiver.on('tweet', (raidTweet) => {
    sendRawRaidTweet(raidTweet);
  });
  start();
}

main();
