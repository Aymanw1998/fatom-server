const asyncHandler = require('../middleware/async');
const errorResponse = require('../utils/errorResponse');
const successResponse = require('../utils/successResponse');
const Customer = require('../models/customer');

/**
 * @desc Get all customers
 * @route GET /api/customer/
 * @access Public
 */
const getCustomers = asyncHandler(async(req, res, next) => {
    console.log("getCustomers");
    const customers = await Customer.find();
    if(!customers)
        return next(new errorResponse('DONT HAVE CUSTOMERS'));
    //return successResponse(req, res, customers);
    return res.status(200).json({
        success: true,
        customers
    })
});

/**
 * @desc Get single customer
 * @route GET /api/customer/:id
 * @access Public
 */
const getCustomer = asyncHandler(async(req, res, next) => {
    const customer = await Customer.findOne({id: req.params.id});
    console.log("customer", customer);
    if(customer.length === 0)
        return next(new errorResponse(`Dont have customer with id :[${req.params.id}]`));
    return res.status(200).json({
            success: true,
            customer
        })
        //return successResponse(req, res, customer);
});

/**
 * @desc Create new customer
 * @route POST /api/customer/
 * @access Public
 */
const createCustomer = asyncHandler(async(req, res, next) => {
    console.log("create new customer", req.body)
    let customerSchema = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        gender: req.body.gender,
        date: req.body.date,
    }

    let customer = await Customer.findOne({id: customerSchema.id});
    console.log("customer", customer);
    if(customer)
        return next(new errorResponse(`The customer with id :[${req.params.id}] exist`));
    customer = await Customer.create(customerSchema);
    if(!customer)
        return next(new errorResponse(`Cannot create new customer`));
    return res.status(200).json({
            success: true,
            customerSchema,
        })
        //return successResponse(req, res, customerSchema);
});

/**
 * @desc Update customer
 * @route PUT /api/customer/
 * @access Public
 */
const updateCustomer = asyncHandler(async(req, res, next) => {
    console.log("update Customer")
    let customerSchema = {
        id: req.body.id,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        gender: req.body.gender,
        date: req.body.date,
    }
    console.log(customerSchema);
    let customer = await Customer.findOne({id: customerSchema.id});
    if(!customer)
        return next(new errorResponse(`The customer with id :[${req.params.id}] is not exist`));
    customer = await Customer.updateOne({id: customerSchema.id},customerSchema);
    if(!customer)
        return next(new errorResponse(`Cannot create new customer`));
    return res.status(200).json({
            success: true,
            customerSchema
        })
        //return successResponse(req, res, customerSchema);
});

/**
 * @desc Delete customer
 * @route DELETE /api/customer/:id
 * @access Public
 */
const deleteCustomer = asyncHandler(async(req, res, next) => {
    let customer = await Customer.findOne({id: req.params.id});
    if(!customer)
        return next(new errorResponse(`The customer with id :[${req.params.id}] is not exist`));
    await Customer.deleteOne({id: req.params.id})
    .then(async()=>{
        const customers = await Customer.find();
    return res.status(200).json({
        success: true,
        customers
    });
    })
    .catch((err) =>{
        if(err)
            return next(new errorResponse('delete failed', 401));
        })   
});

const updateAvatar = asyncHandler(async(req, res, next) => {
  let myFile = req.file.originalname.split('.');
  // save the type file in the variable
  const typeMyFile = myFile[myFile.length - 1];
  const buffer = req.file.buffer;
  const key = `Avatars/${uuid()}.${typeMyFile}`;
  const bucket = process.env.AWS_BUCKET_NAME;
  await s3.write(buffer, key, bucket);
  const url = await s3.getSignedURL(process.env.AWS_BUCKET_NAME, key, 60);
  let data = await User.updateOne({ _id: req.user._id }, { avatar: url });
  if (data) //return successResponse(req, res, url);
  return res.status(200).json({
    success: true,
    url,
})
})
module.exports = {
    getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer,updateAvatar
}



