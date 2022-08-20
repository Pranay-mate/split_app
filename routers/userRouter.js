const express = require('express');
const { getUsers, addUser }  = require('../controllers/userController.js');
const router = express.Router();

router.get('/getUsers/:userId', getUsers);
router.post('/login', addUser);
// router.post('/getUser/:id', deleteCampaign)
// router.post('/updateUser/:id/:onOff', editCampaign)
module.exports =router;