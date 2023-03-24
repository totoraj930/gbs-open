import { z } from 'zod';

export const EnemyElement = {
  None: 0,
  Fire: 1,
  Water: 2,
  Earch: 3,
  Wind: 4,
  Light: 5,
  Dark: 6,
} as const;

export const zGbsListItem = z.object({
  id: z.number(),
  attr: z.nativeEnum(EnemyElement),
  ja: z.string(),
  en: z.string(),
  image: z.string().nullable(),
  level: z.string(),
  tags: z.array(z.string()),
});
export type GbsListItem = z.infer<typeof zGbsListItem>;

export const zGbsList = z.array(zGbsListItem);
export type GbsList = z.infer<typeof zGbsList>;

export function getEnemyData(enemyId: number, list: GbsList) {
  return list.find((enemy) => enemy.id === enemyId) ?? null;
}
