const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  email: {
    type: String,
    trim: true,
    require: true,
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    enum: ['admin', 'customer', 'shipper'],
    require: true,
  },
  active_code: {
    type: String,
  },
  province: {
    type: String,
  },
  district: {
    type: Number,
  },
  ward: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);

  return token;
};

userSchema.statics.findByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    if (!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Unable to login');
    }

    return user;
  } catch (error) {
    return Promise.reject(error);
  }
};

const User = model('User', userSchema);

module.exports = User;
