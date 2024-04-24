const User = require('../models/userModel.js');
const Group = require('../models/groupModel.js');

// Helper function to handle findById requests
const findById = async (Model, id) => {
    return await Model.findById(id);
};

// Helper function to handle findByEmail requests
const findByEmail = async (Model, email) => {
    return await Model.findOne({ email: email });
};

module.exports.getGroupRequests = async (req, res) => {
    const { userId } = req.params;
    try {
        console.log("getGroupRequests");
        const user = await findById(User, userId);
        const requests = await Promise.all(user.group_requests.map(async (req_id) => {
            return await findById(Group, req_id);
        }));
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error in getGroupRequests:", error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports.getAllGroups = async (req, res) => {
    const { userId } = req.params;
    try {
        console.log("getAllGroups");
        const user = await findById(User, userId);
        const groups = await Promise.all(user.groups.map(async (grp_id) => {
            const group = await findById(Group, grp_id);
            // Populate members field with user IDs
            let members = await User.find({ _id: { $in: group.members } }, '_id name email');
            members = await members.map(user => {
                return {
                    ...user.toJSON(),
                    userName: user.name + ' (' + user.email + ')'
                };
            });
    
            // Populate request_pending field with user objects
            let group_requests = await User.find({ _id: { $in: group.group_requests } }, '_id name email');
            group_requests = await group_requests.map(user => {
                return {
                    ...user.toJSON(),
                    userName: user.name + ' (' + user.email + ')'
                };
            });
            return { ...group.toObject(), members, group_requests };
        }));

        console.log('groups');
        console.log(groups);
        res.status(200).json(groups);
    } catch (error) {
        console.error("Error in getAllGroups:", error.message);
        res.status(400).json({ message: error.message });
    }
};


module.exports.acceptGrpReq = async (req, res) => {
    const { userId, grpId } = req.params;
    try {
        console.log("acceptGrpReq");
        const user = await findById(User, userId);
        if (user.groups.includes(grpId)) {
            return res.status(200).json({ message: "Request Already accepted" });
        } else {
            const user_grp_req = user.group_requests.filter((requestId) => requestId !== grpId);
            user.groups.push(grpId);
            await User.findByIdAndUpdate(userId, { "group_requests": user_grp_req, 'groups': user.groups });
            const group = await findById(Group, grpId);
            const grp_table_req = group.request_pending.filter((requestId) => requestId !== userId);
            group.members.push(userId);
            await Group.findByIdAndUpdate(grpId, { "request_pending": grp_table_req, 'members': group.members });
            res.status(200).json({ message: "Group request accepted" });
        }
    } catch (error) {
        console.error("Error in acceptGrpReq:", error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports.declineGrpReq = async (req, res) => {
    const { userId, grpId } = req.params;
    try {
        console.log("declineGrpReq");
        const user = await findById(User, userId);
        const user_grp_req = user.group_requests.filter((requestId) => requestId !== grpId);
        await User.findByIdAndUpdate(userId, { "group_requests": user_grp_req });
        const group = await findById(Group, grpId);
        const grp_table_req = group.request_pending.filter((requestId) => requestId !== userId);
        await Group.findByIdAndUpdate(grpId, { "request_pending": grp_table_req });
        res.status(200).json({ message: "Group request declined" });
    } catch (error) {
        console.error("Error in declineGrpReq:", error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports.addGroup = async (req, res) => {
    try {
        console.log("addGroup");
        const { group_name, created_by, requests } = req.body;
        if (requests !== undefined) {
            const user = await findByEmail(User, created_by);
            const groupFound = await Group.findOne({ group_name: group_name, created_by: created_by });
            if (groupFound !== null) {
                return res.status(400).json({ statusText: group_name + " Group already exists." });
            }
            const newGroup = new Group({ "group_name": group_name, "created_by": created_by, "request_pending": requests, members: [user._id] });
            const newGroupAdded = await newGroup.save();
            const newGroupId = newGroupAdded._id.toString();
            user.groups.push(newGroupId);
            await User.findOneAndUpdate({ email: created_by }, { 'groups': user.groups });
            await Promise.all(requests.map(async (id) => {
                const user = await findById(User, id);
                user.group_requests.push(newGroupId);
                return user.save();
            }));
            return res.status(200).json({ message: "Group added" });
        } else {
            return res.status(400).json({ message: "Error in adding group" });
        }
    } catch (error) {
        console.error("Error in addGroup:", error.message);
        res.status(400).json({ message: error.message });
    }
};

module.exports.addMembers = async (req, res) => {
    try {
        console.log("addMembers");
        const { grpId } = req.params;
        const members = req.body;
        if (members.length > 0) {
            const group = await findById(Group, grpId);
            await Promise.all(members.map(async (request) => {
                const user = await findById(User, request);
                user.group_requests.push(grpId);
                await user.save();
                group.request_pending.push(request);
            }));
            await group.save();
            res.status(200).json({ message: "Members added to the group" });
        } else {
            res.status(400).json({ message: "Error in adding members to the group" });
        }
    } catch (error) {
        console.error("Error in addMembers:", error.message);
        res.status(400).json({ message: error.message });
    }

    
};

module.exports.deleteGroup = async (req, res) => {
    const { userId, groupId } = req.params;
    try {
        console.log("deleteGroup");
        const user = await findById(User, userId);
        const group = await findById(Group, groupId);

        // Remove user from the group's members
        group.members = group.members.filter(memberId => memberId !== userId);

        // Add user to deleted_by_members
        group.deleted_by_members.push(userId);

        // Save the updated group
        await group.save();
        // Remove group from user's groups list
        user.groups = user.groups.filter(groupId => groupId !== group._id.toString());
        await user.save();

        res.status(200).json({ message: "User removed from the group" });
    } catch (error) {
        console.error("Error in deleteGroup:", error.message);
        res.status(400).json({ message: error.message });
    }
};
