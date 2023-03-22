import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse, URLSearchParams } from 'node:url';
import { z } from 'zod';
import { RaidTweetMini } from '$/redis/schema';
import { raidCache } from '../cache/cache';

export const server = createServer();
type Router = Map<
  string,
  (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => void
>;
const router: Router = new Map();

function resTextWidthOps(
  res: ServerResponse<IncomingMessage>,
  ops: {
    text?: string;
    code?: number;
  }
) {
  res.statusCode = ops.code ?? 200;
  return res.end(ops.text ?? '');
}

const zEnemyId = z.number().min(-1).int();
router.set('/cache', (req, res) => {
  const url = parse(req.url!);
  const params = new URLSearchParams(url.query!);
  const rawQ = params.get('q');
  if (!rawQ) {
    resTextWidthOps(res, { code: 400, text: 'invalid query' });
    return res.end();
  }
  const ids = decodeURIComponent(rawQ)
    .split(/[,%s]/)
    .flatMap((v) => {
      try {
        const num = Number.parseInt(v);
        return [zEnemyId.parse(num)];
      } catch {
        return [];
      }
    })
    .slice(-20);

  const j: { id: number; tweets: RaidTweetMini[] }[] = [];
  for (const id of ids) {
    const tweets = raidCache[id] ?? [];
    j.push({ id, tweets });
  }
  res.setHeader('content-type', 'application/json;charset=utf-8');
  res.write(JSON.stringify(j));
  res.end();
});

server.on('request', (req, res) => {
  try {
    const { pathname } = parse(req.url!);
    const paths = router.entries();
    for (const [p, f] of paths) {
      if (pathname === p) {
        return f(req, res);
      }
    }
    res.write(
      'gbs-open-project\nsee...\nhttps://github.com/totoraj930/gbs-open'
    );
    return res.end();
  } catch (err) {
    console.log(err);
  }
  res.statusCode = 500;
  return res.end('Server Error');
});
