// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open-tweet-v2',
      script: './dist/tweet/v2/index.js',
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
      // 再起動はしないほうがいいっぽい
      // cron_restart: '0 * * * *',
    },
  ],
};
