import type { TweetV1, TwitterApi, ErrorV1, ErrorV2 } from 'twitter-api-v2';

export type SearchV1Param = {
  q: string;
  include_ext_edit_control?: boolean;
  lang?: string; // en
  locale?: string; // ja
  result_type?: 'mixed' | 'recent' | 'popular';
  count?: number; // 初期15, 最大100
  until?: string; // 2015-07-19
  since_id?: number;
  max_id?: number;
  include_entities?: boolean;
};

export interface SearchV1Result {
  statuses: TweetV1[];
  search_metadata: {
    completed_in: number; // 0.084(秒単位)
    max_id: number;
    max_id_str: string;
    since_id: number;
    since_id_str: string;
    count: number;
    query: string;
    // ?max_id=1638208831783325696&q=%22Battle%20ID%22%20OR%20%22%E5%8F%82%E6%88%A6ID%22&count=30&result_type=recent
    next_results?: string;
    // ?since_id=1638219132842950662&q=%22Battle%20ID%22%20OR%20%22%E5%8F%82%E6%88%A6ID%22&result_type=recent
    refresh_url?: string;
  };
}

export function isErrorV1(err: ErrorV1 | ErrorV2): err is ErrorV1 {
  return 'code' in err;
}

/**
 * twitter-api-v2にはsearch/tweetsが無いらしいので
 * 自前でラッパーを書けとのこと
 * https://github.com/PLhery/node-twitter-api-v2/issues/135
 */
export function v1SearchTweets(client: TwitterApi, param: SearchV1Param) {
  return client.v1.get<SearchV1Result>('search/tweets.json', param, {
    fullResponse: true,
  });
}

/**
 * 検索用paramを生成
 */
export function getSearchParam(since_id?: number): SearchV1Param {
  return {
    q: currentQuery(),
    result_type: 'recent',
    count: 20,
    since_id,
    include_entities: false,
  };
}

export const queryList = [
  `"参戦ID" OR "Battle ID"`,
  `"Battle ID" OR "参戦ID"`,
  // `"I need backup!" OR "参加者募集！"`,
  // `"参加者募集！" OR "I need backup!"`,
  // `(参戦 AND ID) OR (Battle AND ID)`,
  // `(Battle AND ID) OR (参戦 AND ID)`,
] as const;
let num = 0;
export function currentQuery() {
  num = (num + 1) % queryList.length;
  return queryList[num];
}

export function getTimestamp() {
  return new Date().toLocaleString();
}
