const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const successResponse = require('../utils/successResponse');
const Meeting = require('../models/meeting');
const sendMessage = require('./sendMessage');

const dayNames = ["א", "ב", "ג", "ד", "ה", "ו", "שבת"];
/**
 * @desc Get all meetings
 * @route GET /api/meeting/
 * @access Public
 */
const getMeetings = asyncHandler(async(req, res, next)=> {
    const meetings = await Meeting.find();
    if(!meetings)
        return next(new errorResponse('DONT HAVE meetings'));
    //return successResponse(req, res, customers);
    return res.status(200).json({
        success: true,
        meetings
    })
})

/**
 * @desc Get single meeting
 * @route GET /api/meeting/:id
 * @access Public
 */
const getMeeting = asyncHandler(async(req, res, next) => {
    const meeting = await Meeting.findOne({_id: req.params.id});
    console.log("meeting", meeting);
    if(meeting.length === 0)
        return next(new errorResponse(`Dont have meeting with id :[${req.params.id}]`));
    return res.status(200).json({
            success: true,
            meeting
        })
        //return successResponse(req, res, customer);
});

/**
 * @desc Create new meeting
 * @route POST /api/meeting/
 * @access Public
 */
const createMeeting = asyncHandler(async(req, res, next) => {
    console.log("create", req.body);

    //if customer is exist
    const CustomerModel = require('../models/customer');
    const customer = await CustomerModel.findOne({id: req.body.customer.split(' ')[0]});
    console.log("customer", customer);
    if(!customer){
        return next(new errorResponse(`The customer with id :[${req.body.customer.split(' ')[0]}] is not exist`));
    }
    
    //date is empty
    req.body.date = new Date(req.body.date);
    const meetingBySameDate = Meeting.findOne({date: req.body.date});
    if(!meetingBySameDate){
        return next(new errorResponse(`We have meeting with same date`));
    }
    
    
    let meetingSchema = {
        title: req.body.title,
        customer: req.body.customer,
        date: new Date(req.body.date), 
        status: false,
        text: req.body.text,
        newborn: req.body.newborn,
    }
    const Customer = require('./../models/customer');
    let c = await Customer.findOne({id: meetingSchema.customer.split(' ')[0]});
    console.log("c", c.id, c.firstname +" " + c.lastname, c.phone);
    var d = meetingSchema.date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' +d.getFullYear(),
    hh = d.getHours(),
    mm = d.getMinutes(); 

    month = (month.length < 2 ? '0' : '') + month;
    day = (day.length < 2 ? '0' : '') + day;
    hh = (hh < 10 ? '0' : '') + hh;
    mm = (mm < 10 ? '0' : '') + mm;
    const b = {
        text: `היי, ${c.firstname +" " + c.lastname} בעל ת.ז. ${c.id} נקבע לך פגישה צילום ${meeting.newborn == true ? " ניובורן" : ""}\nבתאריך: ${day +"/" + month + "/" + year},יום ${dayNames[meetingSchema.date.getDay()]} ובשעה ${hh+":"+mm},${meetingSchema.text !== "" ? "הערה:" + meetingSchema.text : ""}.\n יום טוב`,
        from: `fatom`,
        to: c.phone,
        }
    await sendMessage.sendMessage(b);
    await Meeting.create(meetingSchema);
    meetingSchema = await Meeting.findOne(meetingSchema);
    return res.status(200).json({
        success: true,
        meetingSchema
    });
});

// @desc    Update meeting
// @route   PUT /api/meeting/:id
// @access  Private with token
const updateMeeting = asyncHandler(async (req, res, next) => {
    console.log("update", req.body);

    let meeting = await Meeting.findById(req.params.id);
    if(!meeting){
        return next(new errorResponse(`The meeting with id :[${req.params.id}] is not exist`));
    }
    //if customer is exist
    const CustomerModel = require('../models/customer');
    const customer = await CustomerModel.findOne({id: req.body.customer.split(" ")[0]});
    console.log("customer", customer);
    if(!customer){
        return next(new errorResponse(`The customer with id :[${req.body.customer}] is not exist`));
    }
    //date is empty
    req.body.date = new Date(req.body.date);
    const meetingBySameDate =await Meeting.find({date: req.body.date});
    console.log("meetingBySameDate", meetingBySameDate);
    
    meetingBySameDate.map(m => {
        if(m._id != req.body._id){
            return next(new errorResponse(`We have meeting with same date`));
        }
    })
    console.log("newborn", req.body.newborn);
    let meetingSchema = {
        title: req.body.title,
        customer: req.body.customer,
        date: new Date(req.body.date), 
        status: false,
        text: req.body.text,
        newborn: req.body.newborn,
    }
    const Customer = require('./../models/customer');
    let c = await Customer.findOne({id: meetingSchema.customer.split(' ')[0]});
    console.log("c", c.id, c.firstname +" " + c.lastname, c.phone);
    var d = meetingSchema.date,
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear(),
    hh =  d.getHours(),
    mm = d.getMinutes(); 

    month = (month.length < 2 ? '0' : '') + month;
    day = (day.length < 2 ? '0' : '') + day;
    hh = (hh < 10 ? '0' : '') + hh;
    mm = (mm < 10 ? '0' : '') + mm;
    const b = {
        text: `היי, ${c.firstname +" " + c.lastname} בעל ת.ז. ${c.id} עודכן פגישה צילום ${meeting.newborn == true ? " ניובורן" : ""}\nבתאריך: ${day +"/" + month + "/" + year},יום ${dayNames[meetingSchema.date.getDay()]} ובשעה ${hh+":"+mm},${meetingSchema.text !== "" ? "הערה:" + meetingSchema.text : ""}.\n יום טוב`,
        from: `fatom`,
        to: c.phone,
        }
    await sendMessage.sendMessage(b);
    meeting = await Meeting.findByIdAndUpdate(req.params.id, meetingSchema);
    meeting = await Meeting.findById(req.params.id);
    meetingSchema = meeting;
    return res.status(200).json({
        success: true,
        meetingSchema
    });
});

// @desc    Delete meeting
// @route   DELETE /api/meeting/:id
// @access  Private with token
const deleteMeeting = asyncHandler(async (req, res, next) => {
    let meeting = await Meeting.deleteOne({ _id: req.params.id });
    
    if(!meeting)
        return next(new errorResponse(`The customer with id :[${req.params.id}] is not exist`));
        const Customer = require('./../models/customer');
        let c = await Customer.findOne({id: meetingSchema.customer.split(" ")[0]});
        console.log("c", c.id, c.firstname +" " + c.lastname, c.phone);
        var d = meetingSchema.date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hh = d.getHours(),
        mm = d.getMinutes(); 
    
        month = (month.length < 2 ? '0' : '') + month;
        day = (day.length < 2 ? '0' : '') + day;
        hh = (hh < 10 ? '0' : '') + hh;
        mm = (mm < 10 ? '0' : '') + mm;
        const b = {
            text: `היי, ${c.firstname +" " + c.lastname} בעל ת.ז. ${c.id} פגישה צילום ${meeting.newborn == true ? " ניובורן" : ""}\nבתאריך: ${day +"/" + month + "/" + year},יום ${dayNames[meetingSchema.date.getDay()]} ובשעה ${hh+":"+mm}\nבוטלה.\n יום טוב`,
            from: `fatom`,
            to: c.phone,
            }
        await sendMessage.sendMessage(b);
    await Meeting.deleteOne({_id: req.params.id})
    .then(async()=>{
        const meetings = await Meeting.find();
    return res.status(200).json({
        success: true,
        meetings
    });
    })
    .catch((err) =>{
        if(err)
            return next(new errorResponse('delete failed', 401));
        })   
});

module.exports = {
    getMeeting, getMeetings, createMeeting, updateMeeting, deleteMeeting,
}