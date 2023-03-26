export const enWords = [
  'Europa',
  'Athena',
  'Uriel',
  'Tefnut',
  'Avatar',
] as const;
export const jaWords = [
  '四大天司ＨＬ',
  'エウロペ',
  'アテナ',
  'ウリエル',
  'テフヌト',
  'アバター',
  'メタトロン',
  'ローズクイーン',
] as const;

export const joinedEnWords = enWords.map((w) => `"${w}"`).join(' OR ');
export const joinedJaWords = jaWords.map((w) => `"${w}"`).join(' OR ');

export const rules = [
  {
    value: `"参戦ID" (${joinedJaWords})`,
    tag: 'gbs',
  },
  {
    value: `"Battle ID" (${joinedEnWords})`,
    tag: 'gbs',
  },
];
