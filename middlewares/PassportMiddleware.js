import passport from 'passport'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import User from '../models/User';

const Strategy = require('passport-local').Strategy;

passport.use('user-local', new Strategy({
        usernameField: 'email'
    },
    function(email, password, cb) {
        User.find({
            email: email
        }).exec(function(err, users) {
            if (err) {
                return cb(err);
            }
            if (!users[0]) {
                return cb(null, false);
            }

            let user = users[0];

            bcrypt.compare(password, user.password, (err, isGood) => {
                if (err || !isGood) {

                  console.log("check", err)
                    return cb(err || {
                        err: isGood + 'not true'
                    })
                }
                return cb(null, user);
            })
        });
    }
));
