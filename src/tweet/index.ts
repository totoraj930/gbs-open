import { env } from '$/config';
import {
  getCurrentClient,
  getIntervalTime,
  getTweet,
  initClientList,
  start,
  tweetReciver,
} from './reciver';

async function main() {
  await initClientList();
  tweetReciver.on('tweet', (raidTweet) => {
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
