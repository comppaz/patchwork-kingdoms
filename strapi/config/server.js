module.exports = ({ env }) => ({
  url: env('MY_HEROKU_URL'),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
