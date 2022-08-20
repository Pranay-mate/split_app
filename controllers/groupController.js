const User = require('../models/userModel.js');
const Group = require('../models/groupModel.js');

const mongoose = require('mongoose');
const { ExpenseDivision } = require('../models/expenseModel.js');

module.exports.getGroupRequests = async (req, res)=>{
    const { userId } = req.params;
    try {
        const users = await User.findById(userId);

        let requests = [];
        console.log("users.request_pending")
        console.log(users)
        for (let req_id of users.group_requests) {
            let group = await Group.findById(req_id)
            console.log("group "+group)
            requests.push(group)
        }

        console.log("requestss :"+ requests)
        res.status(200).json(requests);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports.getAllGroups = async (req, res)=>{
    const { userId } = req.params;
    try {
        const users = await User.findById(userId);

        let groups = [];
        console.log("users.groups")
        console.log(users)
        for (let grp_id of users.groups) {
            let group = await Group.findById(grp_id)
            console.log("group "+group)
            groups.push(group)
        }

        console.log("groups :"+ groups)
        res.status(200).json(groups);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports.acceptGrpReq = async (req, res)=>{
    const { userId, grpId } = req.params;
    try {
        let user = await User.findById(userId);
        let user_grp_req = user.group_requests.filter((requestId)=> requestId !== grpId)
        user.groups.push(grpId)
        let updateUser = await User.findByIdAndUpdate(userId,{"group_requests": user_grp_req,'groups':user.groups});
        console.log("updateGrpReq  "+updateUser)


       
        let group = await Group.findById(grpId);
        let grp_table_req = group.request_pending.filter((requestId)=> requestId !== userId)
        group.members.push(userId)
        console.log("grp_table_req :"+ grp_table_req)
        console.log("users accept req")
        let updateGrpReq = await Group.findByIdAndUpdate(grpId,{"request_pending": grp_table_req,'members':group.members});

        res.status(200).json(updateGrpReq);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports.declineGrpReq = async (req, res)=>{
    const { userId, grpId } = req.params;
    try {
        let user = await User.findById(userId);
        let user_grp_req = user.group_requests.filter((requestId)=> requestId !== grpId)
        let updateUser = await User.findByIdAndUpdate(userId,{"group_requests": user_grp_req});
        console.log("updateGrpReq  "+updateUser)


       
        let group = await Group.findById(grpId);
        let grp_table_req = group.request_pending.filter((requestId)=> requestId !== userId)
        console.log("grp_table_req :"+ grp_table_req)
        console.log("users accept req")
        let updateGrpReq = await Group.findByIdAndUpdate(grpId,{"request_pending": grp_table_req});

        res.status(200).json(updateGrpReq);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}



module.exports.addGroup = async (req, res)=>{
    try {
        const {group_name,created_by, requests} = req.body;
        console.log(group_name)
        console.log(created_by)
        console.log(requests)
        
        if(requests!==undefined){
            let request_pending = []
            requests.forEach((element,id) => {
                element = Object.keys(element).reduce(function(obj, key) {
                    if (key == "_id") {           //key you want to remove
                      obj[key] = element[key];
                    }
                    return obj;
                }, []);
                requests[id]=element._id
            });
    
            //find
            const users = await User.find({email:created_by});
            console.log('find created By :'+users)
            console.log('groups: '+users[0].groups)
            console.log('req groups: '+users[0].group_requests)
    
            // insert
            const newGroup = new Group({"group_name":group_name,"created_by":created_by,"request_pending":requests});
            const newGroupAdded = await newGroup.save();
            console.log('newGroupAdded: '+newGroupAdded)
            console.log('newGroupAdded_id: '+newGroupAdded._id)
            let newGroupId = newGroupAdded._id.toString();
            //adding groups in current login user Table
            users[0].groups.push(newGroupId);
            console.log(users[0].groups)
            const userUpdated = await User.findOneAndUpdate({email:created_by},{'groups':users[0].groups});
            // console.log(userUpdated)
    
            //adding requested in user table
            requests.forEach( async (id)=>{
                let users = await User.findById(id);
                users.group_requests.push(newGroupId)
                let userReqUpdated = await User.findOneAndUpdate({_id:id},{'group_requests':users.group_requests});
            })
    
            // console.log(name)
            res.status(201);
            res.json({newGroupAdded});

        }else{
            console.log("error add group")
        }

    }catch(error){
        console.log(error)
    }
}