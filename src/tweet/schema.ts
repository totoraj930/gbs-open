import { z } from 'zod';

const zRateLimit = z.object({
  limit: z.number(),
  remaining: z.number(),
  reset: z.number(),
});

// export const zRes_Headers = z.object({
//   'x-rate-limit-remaining': z.number(),
//   'x-rate-limit-limit': z.number(),
//   'x-rate-limit-reset': z.number(),
// });

export const zRateLimitStatusRes = z.object({
  resources: z.object({
    search: z.object({
      '/search/tweets': zRateLimit,
    }),
  }),
});

export const zUserRes = z.object({
  id: z.number(),
  id_str: z.string(),
  name: z.string(),
  screen_name: z.string(),
});

export const zTweetRes = z.object({
  created_at: z.string(),
  id: z.number(),
  id_str: z.string(),
  text: z.string(),
  entities: z.any().nullable(),
  source: z.string(),
  user: zUserRes,
});

export const zSearchTweetsRes = z.object({
  statuses: z.array(zTweetRes),
  // _headers: zRes_Headers,
});

export const queryList = [
  `"参戦ID" OR "Battle ID"`,
  `"Battle ID" OR "参戦ID"`,
  // `"I need backup!" OR "参加者募集！"`,
  // `"参加者募集！" OR "I need backup!"`,
  // `(参戦 AND ID) OR (Battle AND ID)`,
  // `(Battle AND ID) OR (参戦 AND ID)`,
];
let num = 0;
export function currentQuery() {
  num = (num + 1) % queryList.length;
  return queryList[num];
}

export function parseRateLimitHeaders(twitRes: any) {
  return {
    limit: twitRes?._headers?.get('x-rate-limit-remaining') - 0 ?? 0,
    resetTime:
      (twitRes?._headers?.get('x-rate-limit-reset') ?? Date.now() / 1000) *
      1000,
  };
}
