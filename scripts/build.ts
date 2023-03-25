import { Options, build } from 'tsup';
import { argv } from 'process';

const modeList = ['all', 'site', 'tweet', 'cache', 'stream', 'util'] as const;
type Mode = typeof modeList[number];
function getMode(): Mode {
  for (const m of modeList) {
    if (argv.indexOf('--' + m) >= 0) return m;
  }
  return 'all';
}

function serverBuild(mode: Mode) {
  if (mode === 'util' || mode === 'all') return;
  return build({
    entry: [`src/${mode}/index.${mode === 'site' ? 'tsx' : 'ts'}`],
    splitting: false,
    sourcemap: 'inline',
    dts: false,
    format: ['cjs'],
    outDir: `dist/${mode}`,
  });
}

async function utilsBuild() {
  const baseOps: Options = {
    splitting: true,
    sourcemap: 'inline',
    dts: true,
    format: ['esm', 'cjs'],
  };

  return Promise.all([
    build({
      ...baseOps,
      entry: ['src/utils/index.ts'],
      outDir: '../gbs-open-lib',
    }),
    build({
      ...baseOps,
      entry: ['src/utils/server.ts'],
      outDir: '../gbs-open-lib',
    }),
  ]);
}

function runBuild(mode: Mode) {
  if (mode === 'all') return;
  if (mode === 'util') {
    return utilsBuild();
  } else {
    return serverBuild(mode);
  }
}

async function main() {
  const mode = getMode();
  if (mode === 'all') {
    const tasks: Mode[] = ['tweet', 'cache', 'site', 'stream'];
    await Promise.all(tasks.map((mode) => runBuild(mode)));
  } else {
    await runBuild(mode);
  }
}

main();
