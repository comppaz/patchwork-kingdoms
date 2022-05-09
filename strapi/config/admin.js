module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '7b5a6287b8d6522ef00029a577212d49'),
  },
});
