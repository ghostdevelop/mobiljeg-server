import express from 'express';
import passport from 'passport';
import AuthMiddleware from '../middlewares/AuthMiddleware';
import { Ticket } from '../controllers/ticket';

const router = express.Router();

// API data/ticket/

router.route('/')
  .get(AuthMiddleware.authenticated, AuthMiddleware.isAuthorized('admin'), Ticket.getAll);

router.route('/new-ticket')
  .post(AuthMiddleware.isUser, Ticket.newTicket);

router.route('/ticket-status')
  .post(Ticket.ticketStatus);

router.route('/use-ticket')
  .post(AuthMiddleware.authenticated, AuthMiddleware.isAuthorized('admin'), Ticket.useTicket);


export default router;
