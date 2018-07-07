module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  mongoURI: process.env.MONGO_URI,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,

  cookieKey: process.env.COOKIE_KEY,

  stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
