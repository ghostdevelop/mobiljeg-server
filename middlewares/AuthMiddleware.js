'use strict';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import config from '../config/server';

class Auth {
  static isAuthorized(roles) {
    return (req, res, next) => {
      if (!req.user) return res.status(403).send({ err: 'Unauthorized action!' });

      const roles = Array.from(arguments);
      const anyOfRolesMatch = roles.includes(req.user.role)

      if (!anyOfRolesMatch) return res.status(400).send({ err: 'Unauthorized action!' });

      next();
    }
  }

  static isUser(req, res, next){
    let token = req.cookies.accessToken || req.headers.jwttoken;

    jwt.verify(token, config.JWT_SECRET, (err, payload) => {
      if (err) next();

      const IDfromPayload = payload._id;

    User
      .findById(IDfromPayload)
      .select({
        password: false
      })
      .exec((err, user) => {
        if(err || !user) next();
        req.user = user;
        next();
      })
    })
  }

  static authenticated(req, res, next) {
    let token = req.cookies.accessToken || req.headers.jwttoken;

    jwt.verify(token, config.JWT_SECRET, (err, payload) => {
      if (err) return res.status(401).send({ err: 'Must be authenticated.' });

      const IDfromPayload = payload._id;

    User
      .findById(IDfromPayload)
      .select({
        password: false
      })
      .exec((err, user) => {
        if(err || !user) return res.status(400).send({ err: 'No user was found.' })
        req.user = user;
        next();
      })
    })
  }
}


export default Auth;
