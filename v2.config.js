// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open-tweet-v2',
      script: './dist/tweet/v2/index.js',
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
      // やっぱ再起動する
      cron_restart: '0 * * * *',
    },
  ],
};
