const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

const bodyParser = require('body-parser');
const keys = require('./config/keys');

// order for require statement is important here!!!
require("./models/User");
require("./models/Survey");
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
require("./routes/surveyRoutes")(app);

// Make sure express behaves correctly in production
if (process.env.NODE_ENV === 'production') {
  // Express will serve up production assets
  // Like our main.js file or main.css file
  app.use(express.static('client/build'));

  // Express will serve up index.html frile
  // If it does not recognize the route
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started, Listening at port ${PORT}...`);
});
