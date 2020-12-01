'use strict';
require('dotenv').config();
const store = require('./store.json');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const morgan = require('morgan');

console.log(process.env.API_TOKEN);
console.log(process.env.name);

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization');
  console.log(authToken, 'authToken');
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }
  next();
});

app.get('/movie', function handleGetMovie(req, res) {
  let response = store;

  if (req.query.genre) {
    response = response.filter(movie =>
      movie.genre.toLowerCase().includes(req.query.genre.toLowerCase())
    );
  }

  if (req.query.country) {
    response = response.filter(movie =>
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(movie =>
      Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});



app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});


