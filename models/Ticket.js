import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  qty: { type: Number, required: true },
  usedQty: { type: Number, default: 0},
  status: { type: String },
  summary: { type: Number, required: true }
}, { timestamps: true });

ticketSchema.methods.useTicket = function(qty, cb) {
  qty = parseInt(qty)
  let sum = this.qty - this.usedQty - qty;

  if (sum < 0 || this.status !== "Succeeded")
    return cb(true, undefined)



  if (sum === 0)
    this.status = "used"

  this.usedQty += qty

  console.log("usedQty", this.usedQty)
  this.save(cb)
}

const Ticket = mongoose.model('Ticket', ticketSchema);

export default Ticket;
