// routes/comments.js
const express = require('express');
const router = express.Router();

let comments = [];

// GET comments
router.get('/', (req, res) => {
  res.json(comments);
});

// POST a new comment
router.post('/', (req, res) => {
  const { name, comment } = req.body;
  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required.' });
  }
  const newComment = { name, comment, date: new Date() };
  comments.push(newComment);
  res.status(201).json(newComment);
});

module.exports = router;
