import { tweetEnv } from './config';
import { findUser } from '@/db';
import TwitterApi from 'twitter-api-v2';
import { v1SearchTweets } from './schema';

/**
 * 実験用
 */

async function main() {
  const user = await findUser({
    where: {
      twitterId: '1127684305772146688',
    },
  });
  if (!user) {
    console.log('user not found');
    return;
  }
  if (!user.oauthToken || !user.oauthTokenSecret) {
    console.log('not has token');
    return;
  }
  const client = new TwitterApi({
    appKey: tweetEnv.CONSUMER_KEY,
    appSecret: tweetEnv.CONSUMER_SECRET,
    accessToken: user.oauthToken,
    accessSecret: user.oauthTokenSecret,
  });

  const res = await v1SearchTweets(client, {
    q: 'エウロペ',
    count: 30,
    result_type: 'recent',
  });
  console.log(res.data.search_metadata);
  for (const tweet of res.data.statuses) {
    console.log(tweet.text);
  }
}

main();
