const express = require('express');
const { addGroup,getGroupRequests,acceptGrpReq,getAllGroups,declineGrpReq }  = require('../controllers/groupController.js');
const router = express.Router();

router.get('/getRequestedGroup/:userId', getGroupRequests);
router.get('/getAllGroups/:userId', getAllGroups);
router.get('/acceptGrpReq/:userId/:grpId', acceptGrpReq);
router.get('/declineGrpReq/:userId/:grpId', declineGrpReq);
router.post('/addGroup', addGroup);

// router.post('/updateUser/:id/:onOff', editCampaign)
module.exports =router;