import { argv } from 'process';
import { deleteAllRules, getRules, setRules, startStream } from './api';

const ProcessType = ['get', 'set', 'stream', 'delete'] as const;
type ProcessType = typeof ProcessType[number];
function getProcessType(): ProcessType {
  for (const t of ProcessType) {
    if (argv.includes(`--${t}`)) return t;
  }
  return 'stream';
}

async function main() {
  const type = getProcessType();

  console.log('--' + type);

  switch (type) {
    case 'get': {
      const rules = await getRules();
      if (!rules) {
        console.log('no rules');
        break;
      }
      for (const rule of rules) {
        console.log(rule);
      }
      break;
    }
    case 'set': {
      const res = await setRules();
      for (const rule of res.data) {
        console.log(rule);
      }
      break;
    }
    case 'delete': {
      const res = await deleteAllRules();
      console.log(res?.meta.summary.deleted ?? 0);
      break;
    }
    case 'stream': {
      startStream();
    }
  }
}

main();
