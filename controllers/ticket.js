import bcrypt from 'bcryptjs';

import TicketDB from '../models/Ticket';

class Ticket {

  static newTicket(req, res) {
    let ticketObj = req.body;

    let ticket = new TicketDB({
      name: ticketObj.name,
      email: ticketObj.email,
      phone: ticketObj.phone,
      qty: ticketObj.qty,
      summary: ticketObj.summary
    });

    ticket.save((err2) => {
      if (err2){
        console.log(err2)
        return res.status(400).send(err2)
      } else {
        return res.send(ticket);
      }
    })
  }

  static getAll(req, res) {
    TicketDB.find({}, (err, tickets) => {
      res.status(err ? 400 : 200).send(err || tickets);
    });
  }

}

export { Ticket };
