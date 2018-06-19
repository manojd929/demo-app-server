const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const keys = require('./config/keys');

// order for require statement is important here!!!
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI, { user: keys.DB_USERNAME, pass: keys.DB_PASSWORD }); 

const app = express();

// to set cookies
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey],
  })
);
app.use(passport.initialize());
app.use(passport.session());
// cookie logic end

require("./routes/authRoutes")(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started, Listening at port ${PORT}...`);
});
