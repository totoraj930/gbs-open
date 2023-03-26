import { tweetEnv } from '@/tweet/config';
import { TwitterApi } from 'twitter-api-v2';
import { HonoContext } from './site';

const client = new TwitterApi({
  appKey: tweetEnv.CONSUMER_KEY,
  appSecret: tweetEnv.CONSUMER_SECRET,
});

const tokenCache = new Map<string, string>();

export function isValidToken(token: string, secret: string) {
  const item = tokenCache.get(token);
  if (!item) return false;
  return item === secret;
}

export async function authUrl(c: HonoContext) {
  const res = await client.generateAuthLink(tweetEnv.OAUTH_CALLBACK, {
    authAccessType: 'read',
    linkMode: 'authorize',
  });
  tokenCache.set(res.oauth_token, res.oauth_token_secret);
  const m5 = 1000 * 60 * 5;
  // 5分でトークン削除
  setTimeout(() => {
    tokenCache.delete(res.oauth_token);
  }, m5);

  c.cookie('ots', res.oauth_token_secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    expires: new Date(Date.now() + m5),
  });

  return res.url;
}

export async function getAccessToken(
  token: string,
  secret: string,
  verifier: string
) {
  if (!isValidToken(token, secret)) return null;
  try {
    const loginClient = new TwitterApi({
      appKey: tweetEnv.CONSUMER_KEY,
      appSecret: tweetEnv.CONSUMER_SECRET,
      accessToken: token,
      accessSecret: secret,
    });
    const res = await loginClient.login(verifier);
    tokenCache.delete(token);
    return res;
  } catch {
    tokenCache.delete(token);
    return null;
  }
}
