import express from 'express';
import passport from 'passport';
import { Account, Auth } from '../controllers/auth';
import AuthMiddleware from '../middlewares/AuthMiddleware';

const router = express.Router();

// API data/auth/

router.route('/register')
  .post(Account.userRegister);

router.route('/login')
  .post(passport.authenticate('user-local', { session: false } ), Auth.login);

router.route('/authenticate')
  .get(AuthMiddleware.authenticated, AuthMiddleware.isAuthorized('user', 'admin'), Auth.authenticate)

router.route('/fb_auth')
  .post(Auth.fbAuth);

router.route('/logout')
  .delete(AuthMiddleware.authenticated, AuthMiddleware.isAuthorized('user', 'admin'), Auth.logout);

export default router;
