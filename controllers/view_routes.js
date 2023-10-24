const router = require('express').Router();
const { User, Blog, Comment } = require('../models');

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
      attributes: ['id', 'user_name']
     })
     
     req.user = user.get({ plain: true })
  }

  next();
}

// Add one test GET route at root localhost:PORT/
router.get('/', isAuthenticated, authenticate, async (req, res) => {

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

router.get('/comment/:id', isAuthenticated, authenticate, async (req, res) => {

  const blog = await Blog.findByPk(req.params.id, {
    include: {
      model: User,
      as: 'author'
    }
  });

  const comments = await Comment.findAll({
    include: [
      {
        model: User,
        as: 'author'
      },
      {
        model: Blog
      }
    ]
  });
  
  res.render('comment_form', { 
    user: req.user,
    blog: blog.get({ plain: true }),
    comments: comments.map(c => c.get({ plain: true }))
  });
});

// Show Edit Form
router.get('/blog/edit/:id', isAuthenticated, authenticate, async (req, res) => {
  const blog = await Blog.findByPk(req.params.id);

  res.render('edit_blog_form', {
    user: req.user,
    blog: blog.get({ plain: true })
  })
})


module.exports = router;