import mongoose from 'mongoose'
import jwt from 'jsonwebtoken';
import moment from 'moment';
import config from '../config/server';

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  phone: { type: String },
  contactInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    city: { type: String },
  },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
}, { timestamps: true });

userSchema.methods.makeToken = function() {
  let token = jwt.sign({
    _id: this._id,
    role: this.role,
    exp: moment().add(1, 'week').unix() // in seconds
  }, config.JWT_SECRET);

  return token;
};

userSchema.methods.addTicket = function(ticketID, cb){
  this.tickets.push(ticketID);
  this.save(cb);
}

const User = mongoose.model('User', userSchema);

export default User;
