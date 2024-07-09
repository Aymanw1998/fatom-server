const{getMeeting, getMeetings, createMeeting, updateMeeting, deleteMeeting,} = require("./../controllers/meeting");
const express = require('express');
const multer = require('multer');
const router = express.Router();

router.route('/').get(getMeetings);
router.route('/:id').get(getMeeting);
router.route('/').post(createMeeting);
router.route('/:id').put(updateMeeting);
router.route('/:id').delete(deleteMeeting);
module.exports = router;