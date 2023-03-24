// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open-stream',
      script: './dist/stream/index.js',
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      instances: 1,
      // 再起動
      // cron_restart: '0,15,30,45 * * * *',
    },
  ],
};
