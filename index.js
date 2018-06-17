const express = require('express');

// const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello World'});
});

app.listen(PORT, () => {
  console.log(`Server started, Listening at port ${PORT}...`)
});
