// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open',
      script: './dist/index.js',
      exec_mode: 'fork',
      instances: 1,
    },
  ],
};
