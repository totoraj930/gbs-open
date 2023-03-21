import { env } from '$/config';
import {
  getCurrentClient,
  getIntervalTime,
  getTweet,
  initClientList,
  start,
  tweetReceiver,
} from './receiver';

async function main() {
  await initClientList();
  tweetReceiver.on('tweet', (raidTweet) => {
    // console.log(
    //   Date.now() - raidTweet.time,
    //   raidTweet.battle_id,
    //   raidTweet.level,
    //   raidTweet.enemy_name
    // );
  });
  start();
}

main();
