import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/server';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  phone: { type: String },
  rating: { type: Number },
  contactInfo: {
    name: { type: String, default: '' },
    email: { type: String, unique: true },
    phone: { type: String },
    company: { type: String },
    city: { type: String },
  }
}, { timestamps: true });

userSchema.methods.makeToken = function() {
  let token = jwt.sign({
    _id: this._id,
    role: this.role,
    exp: moment().add(1, 'week').unix() // in seconds
  }, config.JWT_SECRET);

  return token;
};

const User = mongoose.model('User', userSchema);

export default User;
