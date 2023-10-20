const router = require('express').Router();
const User = require('../models/User');
const Blog = require('../models/Blog');

function isLoggedIn(req, res, next) {
  if (req.session.user_id) {
    return res.redirect('/');
  }

  next();
}

function isAuthenticated(req, res, next) {
  if (!req.session.user_id) {
    return res.redirect('/login');
  }

  next();
}

async function authenticate(req, res, next) {
  const userId = req.session.user_id

  if (userId) {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'email']
     })
     
     req.user = user.get({ plain: true })
     console.log('User', req.user);
  }

  next();
}

// Add one test GET route at root localhost:PORT/
router.get('/', authenticate, async (req, res) => {

  const blogs = await Blog.findAll({
    include: {
      model: User,
      as: 'author'
    }
  });

  res.render('landing', { 
    user: req.user,
    blogs: blogs.map(b => b.get({ plain: true }))
  });

});

router.get('/register', isLoggedIn, authenticate, (req, res) => {
  res.render('register_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

router.get('/login',isLoggedIn, authenticate, (req, res) => {
  res.render('login_form', {
    errors: req.session.errors,
    user: req.user
  });

  req.session.errors = [];
});

router.get('/dashboard', isAuthenticated, authenticate, async (req, res) => {
  
  const blogs = await Blog.findAll({
    where: {
      author_id: req.user.id
    },
    include: {
      model: User,
      as: 'author'
    }
  });

  res.render('dashboard', { 
    user: req.user,
    blogs: blogs.map(b => b.get({ plain: true }))
  });
});

router.get('/blog', isAuthenticated, authenticate, (req, res) => {
  res.render('blog_form', {
    user: req.user
  });
});


module.exports = router;