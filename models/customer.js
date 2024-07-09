const mongoose = require('mongoose');

// Define the Meeting Schema
const customerSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  avatar:{
    type:String,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  gender:{
    type:String,
    required: true,
  },
  date: {
    type: Date,
    require: true,
  }
});

// Create the Meeting model
const Customer = mongoose.model('customer', customerSchema);

module.exports = Customer;
