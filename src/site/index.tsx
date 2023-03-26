import { Hono, Context } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { siteEnv } from './config';
import { authUrl, getAccessToken } from '../twitter';
import type { User } from '@prisma/client';
import {
  deleteSession,
  generateSessionToken,
  getActiveUserCount,
  getUsersFromSession,
  toggleActive,
  upsertUser,
} from '../db';
import { IndexPage } from './pages';
import { html } from 'hono/html';

type Variables = {
  user?: User | null;
};
export type HonoContext = Context<{ Variables: Variables }>;
const app = new Hono<{ Variables: Variables }>();

app.use('/static/*', serveStatic({ root: './' }));
app.use('*', async (c, next) => {
  const session = c.req.cookie()?.session;
  if (!session) return await next();
  const user = await getUsersFromSession(session);
  c.set('user', user);
  await next();
});

app.get('/', async (c) => {
  return c.html(<IndexPage c={c} count={await getActiveUserCount()} />);
});

app.get('/auth/login', async (c) => {
  return c.redirect(await authUrl(c), 302);
});

app.get('/auth/logout', async (c) => {
  await deleteSession(c.req.cookie().session);
  return c.redirect('/');
});

app.get('/auth/toggle/:flag', async (c) => {
  const user = c.get('user');
  if (!user) return c.redirect('/');
  const { flag } = c.req.param();
  const f = flag.toLowerCase();
  if (/^true$/.test(f)) {
    await toggleActive(user.id, true);
  } else if (/^false$/.test(f)) {
    await toggleActive(user.id, false);
  }
  return c.redirect('/');
});

app.get('/auth/callback', async (c) => {
  const { oauth_token, oauth_verifier } = c.req.query();
  const { ots } = c.req.cookie();
  if (!oauth_token || !oauth_verifier || !ots) {
    return c.html(
      html`<h1>認証エラー</h1>
        <a href="/">トップへ戻る</a>`,
      500
    );
  }

  const res = await getAccessToken(oauth_token, ots, oauth_verifier);
  if (!res) {
    return c.html(
      html`<h1>認証エラー</h1>
        <a href="/">トップへ戻る</a>`,
      403
    );
  }

  const user = await upsertUser({
    twitterId: res.userId,
    screenName: res.screenName,
    oauthToken: res.accessToken,
    oauthTokenSecret: res.accessSecret,
  });
  const session = await generateSessionToken(user.id);

  c.cookie('session', session.sessionToken, {
    path: '/',
    httpOnly: true,
    sameSite: 'Lax',
    secure: true,
    expires: session.expires,
  });

  return c.redirect('/');
});

const port = Number.parseInt(siteEnv.PORT);
serve({
  port,
  fetch: app.fetch,
}).on('listening', () => {
  console.log('🚀 listening...', ':' + port);
});

export default app;
