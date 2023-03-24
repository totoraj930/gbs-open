import axios from 'axios';
import { GbsList, zGbsList } from './utils';

export let gbsList: GbsList = [];

export async function initGbsList(url: string) {
  const { data } = await axios.get(url);
  gbsList = zGbsList.parse(data);
}

export function getEnemyId(name: string, level: string) {
  const enemy = gbsList.find((item) => {
    return (item.en === name || item.ja === name) && item.level === level;
  });
  return enemy?.id ?? -1;
}
