const express = require('express');
const {
  createPost,
  getPosts,
  postByUser,
  postById,
  isPoster,
  deletePost,
  updatePost
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');

const router = express.Router();

router.get('/posts', requireSignin, getPosts);
router.post(
  '/post/new/:userId',
  requireSignin,
  createPost,
  createPostValidator
);
router.get('/posts/by/:userId', requireSignin, postByUser);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

//any route containing :userId our app will first execute userByID()
router.param('userId', userById);
//any route containing :postById our app will first execute postById()
router.param('postId', postById);

module.exports = router;
