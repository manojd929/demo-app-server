const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const bodyParser = require('body-parser');
const keys = require('./config/keys');

// order for require statement is important here!!!
require("./models/User");
require("./services/passport");

mongoose.connect(keys.mongoURI, { user: keys.dbUser, pass: keys.dbPassword }); 

const app = express();

app.use(bodyParser.json());

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
require("./routes/billingRoutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started, Listening at port ${PORT}...`);
});
