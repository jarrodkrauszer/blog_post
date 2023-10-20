const { Model, DataTypes  } = require('sequelize');
const db = require('../config/connection');
const dayjs = require('dayjs');

class Comment extends Model {}

Comment.init({
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  blog_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user_blogs',
      key: 'id'
    }
  },
  date: {
    type: DataTypes.VIRTUAL,
    get() {
      return dayjs(this.createdAt).format('MM/DD/YYYY');
    }
  },
}, {
  modelName: 'comment',
  sequelize: db
});


module.exports = Comment;