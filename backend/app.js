const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');

const app = express();

mongoose.connect("mongodb+srv://finix_dev:ClAZyPMjelL6VRte@littledevcluster-o82sx.mongodb.net/node-angular?retryWrites=true")
  .then(() => {
    console.log('Connected to database');
  })
  .catch(() => {
    console.log('Connection to mongo failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPIONS');
  next();
});

app.use('/api/posts', postRoutes);

module.exports = app;