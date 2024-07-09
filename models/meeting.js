const { request } = require('express');
const mongoose = require('mongoose');

// Define the Meeting Schema
const meetingSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    customer:{
        type: String,
    },
    date: {
        type: Date,
        required: [true, "Please add a date by -> new Date(y, m, d, h, m)"],
    }, 
    status: {
        type: Boolean,
    },
    text: {
        type: String,
    },
    newborn:{
        type:Boolean
    }
});

// Create the Meeting model
const Meeting = mongoose.model('meeting', meetingSchema);

module.exports = Meeting;
