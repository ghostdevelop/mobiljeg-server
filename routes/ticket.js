import express from 'express';
import passport from 'passport';
import { Ticket } from '../controllers/ticket';

const router = express.Router();

// API data/ticket/

router.route('/')
  .get(Ticket.getAll);

router.route('/new-ticket')
  .post(Ticket.newTicket);

export default router;
