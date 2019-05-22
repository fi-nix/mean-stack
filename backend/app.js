const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

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
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPIONS');
  next();
});

app.post( '/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content:req.body.content
  });
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
});
// ClAZyPMjelL6VRte
app.get( '/api/posts', (req, res, next) => {

  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully',
        posts: documents
      });
    });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id}).then(result => {
    res.status(200).json({ message: "Post deleted"});
  });
});

module.exports = app;
