// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'gbs-open',
      script: './dist/index.js',
      exec_mode: 'fork',
      instances: 1,
      // cron_restart: '0 * * * *',
      env: {
        OAUTH_CALLBACK: 'https://gbs-open.eriri.net/auth/callback',
      },
    },
  ],
};
