import { env } from './config';
import Twitter, { AccessTokenOptions } from 'twitter-lite';

const client = new Twitter({
  consumer_key: env.CONSUMER_KEY,
  consumer_secret: env.CONSUMER_SECRET,
});

const URL = {
  requestToken: 'https://api.twitter.com/oauth/request_token',
  accessToken: 'https://api.twitter.com/oauth/access_token',
  authorize: 'https://api.twitter.com/oauth/authorize',
};

const tokenCache = new Map<string, string>();

export async function authUrl() {
  const res = await client.getRequestToken(env.OAUTH_CALLBACK);
  if ('oauth_token' in res) {
    tokenCache.set(res.oauth_token, res.oauth_token_secret);
    setTimeout(() => {
      tokenCache.delete(res.oauth_token);
    }, 1000 * 60 * 5);
    return `${URL.authorize}?oauth_token=${res.oauth_token}`;
  } else {
    throw new Error();
  }
}

export async function getAccessToken(ops: AccessTokenOptions) {
  return client.getAccessToken(ops);
}
