const { Model, DataTypes  } = require('sequelize');
const db = require('../config/connection');

const { hash, compare } = require('bcrypt');

class User extends Model {}

User.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      args: true,
      msg: 'The email is already in use.'
    },
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: 6,
        msg: 'Your password must be at least 6 characters in length'
      }
    }
  }
}, {
  modelName: 'user',
  sequelize: db,
  hooks: {
    async beforeCreate(user) {
      user.password = await hash(user.password, 10);

      return user;
    }
  }
});

// Method on user pulled from the table
User.prototype.validatePass = async function(formPassword) {
  // return await compare(form_password, this.password);
  const isValid = await compare(formPassword, this.password);
  return isValid;
}

module.exports = User;