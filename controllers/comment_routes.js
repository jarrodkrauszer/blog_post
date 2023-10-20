const router = require('express').Router();
const { Comment } = require('../models');

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

router.post('/comment/:id', async (req, res) => {
  try {
    console.log(req.body);

    const comment = await Comment.create({ ...req.body, author_id: req.session.user_id, blog_id: req.params.id });

    res.redirect(`/comment/${req.params.id}`);

  } catch (err) {
    console.log(err);

    // req.session.errors = err.errors.map(err => err.message);
    res.redirect('/register');
  }
});

module.exports = router;