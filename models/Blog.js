const { Model, DataTypes  } = require('sequelize');
const db = require('../config/connection');
const dayjs = require('dayjs');

class Blog extends Model {}

Blog.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: 0,
        msg: 'You can not have an empty title'
      }
    }
  },
  text: {
    type: DataTypes.STRING,
    validate: {
      len: {
        args: 0,
        msg: 'You can not have an empty blog'
      }
    }
  },
  date: {
    type: DataTypes.VIRTUAL,
    get() {
      return dayjs(this.createdAt).format('MM/DD/YYYY');
    }
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  modelName: 'user_blogs',
  freezeTableName: true,
  sequelize: db
});

module.exports = Blog;