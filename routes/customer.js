const express = require('express');
const multer = require('multer');
const router = express.Router();
const {getCustomers, getCustomer, createCustomer, updateCustomer, deleteCustomer, updateAvatar} = require('../controllers/customer');

const storage = multer.memoryStorage({
    acl: 'public-read-write',
    destination: (req, file, callback) => {
        callback(null, '');
    }
});
const upload = multer({ storage }).single('file');
router.route('/avatar').put(upload, updateAvatar)
router.route('/').get(getCustomers);
router.route('/:id').get(getCustomer);
router.route('/').post(createCustomer);
router.route('/:id').put(updateCustomer);
router.route('/:id').delete(deleteCustomer);
module.exports = router;