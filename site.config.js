// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open',
      script: './dist/site/index.js',
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
    },
  ],
};
