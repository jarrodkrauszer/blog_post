const Blog = require('./Blog');
const User = require('./User');
const Comment = require('./Comment');


User.hasMany(Blog, { as: 'blogs', foreignKey: 'author_id' });
Blog.belongsTo(User, { as: 'author', foreignKey: 'author_id' });

Comment.belongsTo(User, { as: 'author', foreignKey: 'author_id' });
User.hasMany(Comment, { foreignKey: 'author_id' });

Comment.belongsTo(Blog, { foreignKey: 'blog_id' });
Blog.hasMany(Comment, { foreignKey: 'blog_id' });

module.exports = {
  Blog,
  User,
  Comment
}