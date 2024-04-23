const express = require('express');
const { addGroup, getGroupRequests, acceptGrpReq, getAllGroups, declineGrpReq, addMembers, deleteGroup } = require('../controllers/groupController.js');
const router = express.Router();

router.get('/getRequestedGroup/:userId', getGroupRequests);
router.get('/getAllGroups/:userId', getAllGroups);
router.get('/acceptGrpReq/:userId/:grpId', acceptGrpReq);
router.get('/declineGrpReq/:userId/:grpId', declineGrpReq);
router.post('/addGroup', addGroup);
router.post('/addMembers/:grpId', addMembers);
router.delete('/deleteGroup/:userId/:groupId', deleteGroup); 

module.exports = router;
