import bcrypt from 'bcryptjs';
import axios from 'axios';

import TicketDB from '../models/Ticket';
import UserDB from '../models/User';

class Ticket {

  static newTicket(req, res) {
    let ticketObj = req.body;
    console.log("req", req.user)

    let ticket = new TicketDB({
      name: ticketObj.name,
      email: ticketObj.email,
      phone: ticketObj.phone,
      qty: ticketObj.qty,
      summary: ticketObj.summary
    });

    ticket.save((err2) => {
      if (err2){
        return res.status(400).send(err2)
      } else {
        req.user.addTicket(ticket._id, (err, ticket) => {
          if (err || !ticket)
            return res.status(400).send(err)

          return res.status(200).send(ticket)
        })
      }
    })
  }

  static ticketStatus(req, res){

    axios.get("https://api.test.barion.com/v2/Payment/GetPaymentState?POSKey=c7fac0dccb2748c6814584a61f18bd7d&PaymentId=" + req.body.PaymentId, {withCredentials: false})
      .then((response) => {
        let PaymentRequestId = response.data.PaymentRequestId

        TicketDB.findByIdAndUpdate(PaymentRequestId, { $set: {status: response.data.Status} }, {new: true}, (err, editedTicket) => {
          if(err) return res.status(400).send(err);

          res.send(editedTicket);
        });
      })
      .catch((err) => {
        console.log(err)
    })
  }

  static useTicket(req, res) {
    let ticketId = req.body.ticketID
    let qty = req.body.usedQty

    TicketDB
    .findById(ticketId)
    .exec((err, ticket) => {
      if(err || !ticket) return res.status(400).send(err);
      ticket.useTicket(qty, (err, ticket) => {
        if (err || !ticket)
          return res.status(400).send(err)

        return res.status(200).send(ticket)

      });
    })
  }

  static getAll(req, res) {
    TicketDB.find({}, (err, tickets) => {
      res.status(err ? 400 : 200).send(err || tickets);
    });
  }

}

export { Ticket };
