const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');

function isAuthenticated(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  next();
}

async function authenticate(req, res, next) {
  const userId = req.session.user_id

  if (userId) {
    const user = await User.findByPk(userId)
     
     req.user = user;
  }

  next();
}

router.post('/dashboard', isAuthenticated, authenticate, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    await req.user.addBlog(blog);

    res.redirect('/');
    
  } catch (err) {
    req.session.errors = error.errors.map(err => err.message);
    res.redirect('/register');
  }
});


module.exports = router;