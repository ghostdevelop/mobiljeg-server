import express from 'express';
import passport from 'passport';
import { Account, Auth } from '../controllers/auth';

const router = express.Router();

// API data/auth/

router.route('/register')
  .post(Account.userRegister);

router.route('/login')
  .post(passport.authenticate('user-local', { session: false } ), Auth.login);

router.route('/fb_auth')
  .post(Auth.fbAuth);

router.route('/logout')
  .delete(Auth.logout);

export default router;
