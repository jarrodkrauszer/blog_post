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

router.post('/blog', isAuthenticated, authenticate, async (req, res) => {
  try {
    const blog = await Blog.create(req.body);

    await req.user.addBlog(blog);

    res.redirect('/dashboard');
    
  } catch (err) {
    console.log(err);

    // req.session.errors = err.errors.map(err => err.message);
    res.redirect('/register');
  }
});

router.put('/blog/:id', isAuthenticated, async (req, res) => {

  await Blog.update(req.body, {
    where: {
      id: req.params.id
    }
  });

  res.redirect('/dashboard');
});

// Delete a Coo
router.delete('/blog/:id', isAuthenticated, async (req, res) => {
  
  await Blog.destroy({
    where: { id: req.params.id }
  });

  res.redirect('/dashboard');
})


module.exports = router;