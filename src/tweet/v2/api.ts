import { sendRaidTweet, sendRawRaidTweet } from '@/redis';
import { parse } from '@totoraj930/gbf-tweet-parser';
import { ETwitterStreamEvent, TwitterApi, UserV2 } from 'twitter-api-v2';
import { tweetEnv } from '../config';
import { rules } from './rules';

const client = new TwitterApi(tweetEnv.BEARER);

export async function getRules() {
  const rules = await client.v2.streamRules();
  return rules.data;
}

export async function setRules() {
  const res = await client.v2.updateStreamRules({
    add: rules,
  });
  return res;
}

export async function deleteAllRules() {
  const rules = await getRules();
  if (!rules) return;
  const res = await client.v2.updateStreamRules({
    delete: {
      ids: rules.map((rule) => rule.id),
    },
  });
  return res;
}

export async function startStream() {
  const stream = await client.v2.searchStream({
    'user.fields': ['id', 'name', 'username'],
    'media.fields': ['type', 'url'],
    'tweet.fields': ['created_at', 'text', 'id', 'author_id'],
    expansions: ['author_id', 'attachments.media_keys'],
    autoConnect: true,
  });

  console.log('Connected');

  stream.on(ETwitterStreamEvent.Connected, () => {
    console.log('Connected');
  });

  stream.on(ETwitterStreamEvent.ConnectError, () => {
    console.error('ConnectError');
  });

  stream.on(ETwitterStreamEvent.Reconnected, () => {
    console.log('Reconnected');
  });

  stream.on(ETwitterStreamEvent.Data, (res) => {
    const text = res.data.text;
    const user_id = res.data.author_id ?? '-1';
    const tweet_id = res.data.id;
    const created_at = new Date(res.data.created_at ?? Date.now()).getTime();
    const user = getUserData(res.includes?.users ?? [], user_id);
    const gbsTweet = parse(text);
    if (!gbsTweet) return;
    const serverTime = Date.now();
    sendRawRaidTweet({
      battle_id: gbsTweet.battleId,
      enemy_name: gbsTweet.enemyName,
      language: gbsTweet.language,
      level: gbsTweet.level,
      comment: gbsTweet.comment,
      elapsed_time: serverTime - created_at,
      tweet_id,
      user_id,
      time: created_at,
      name: user.name,
      screen_name: user.screen_name,
    });
  });
}

function getUserData(users: UserV2[], id: string) {
  const user = users.find((v) => v.id === id);
  if (!user) {
    return {
      name: '',
      screen_name: '',
      id,
    };
  }
  return {
    name: user.name ?? '',
    screen_name: user.username ?? '',
    id,
  };
}
