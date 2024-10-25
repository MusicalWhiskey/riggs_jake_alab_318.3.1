require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const usersRouter = require('./routes/users.js');
const postsRouter = require('./routes/posts.js');
const commentsRouter = require('./routes/comments.js'); // Import comments router
const error = require('./utilities/error.js');
const path = require('path');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: true }));

// New logging middleware to help us keep track of requests during testing!
app.use((req, res, next) => {
  const time = new Date();
  console.log(
    `-----${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
  );
  if (Object.keys(req.body).length > 0) {
    console.log('Containing the data:');
    console.log(`${JSON.stringify(req.body)}`);
  }
  next();
});

// Router Set Up
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/comments', commentsRouter); // Use comments router

// New User form
app.get('/users/new', (req, res) => {
  // only works for GET and POST request be default
  // if you are trying to send a PATCH, PUT, DELETE, etc. Look into method-override packed
  res.send(`
    <div>
      <h1>Create a User</h1>
      <form action="/api/users" method="POST">
        Name: <input type="text" name="name" />
        <br />
        Username: <input type="text" name="username" />
        <br />
        Email: <input type="text" name="email" />
        <br />
        <input type="submit" value="Create User" />
      </form>
    </div>
  `);
});

// Download Example
app.use(express.static('./data'));

app.get('/get-data', (req, res) => {
  res.send(`
    <div>
      <h1>Download Data</h1>
      <form action="/download/users.js">
        <button>Download Users data</button>
      </form>
      <form action="/download/posts.js">
        <button>Download Posts data</button>
      </form>
    </div>
  `);
});

app.get('/download/:filename', (req, res) => {
  res.download(path.join(__dirname, 'data', req.params.filename));
});

// Adding some HATEOAS links.
app.get('/', (req, res) => {
  res.json({
    links: [
      {
        href: '/api',
        rel: 'api',
        type: 'GET',
      },
    ],
  });
});

app.get('/api', (req, res) => {
  res.json({
    links: [
      {
        href: 'api/users',
        rel: 'users',
        type: 'GET',
      },
      {
        href: 'api/users',
        rel: 'users',
        type: 'POST',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'GET',
      },
      {
        href: 'api/posts',
        rel: 'posts',
        type: 'POST',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'GET',
      },
      {
        href: 'api/comments',
        rel: 'comments',
        type: 'POST',
      },
    ],
  });
});

// Comment form
app.get('/comments/new', (req, res) => {
  res.send(`
    <div>
      <h1>Post a Comment</h1>
      <form action="/api/comments" method="POST">
        Name: <input type="text" name="name" />
        <br />
        Comment: <textarea name="comment"></textarea>
        <br />
        <input type="submit" value="Post Comment" />
      </form>
    </div>
  `);
});

// 404 Error Handling Middleware
app.use((req, res, next) => {
  next(error(404, 'Resource Not Found'));
});

// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
