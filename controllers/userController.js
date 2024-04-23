const User = require('../models/userModel.js');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const mongoose = require('mongoose');

module.exports.getUsers = async (req, res) => {
    try {
        console.log("getUsers");
        let users = await User.find();
        
        // Modify each user object to include userName property
        users = users.map(user => {
            return {
                ...user.toJSON(),
                userName: user.name + ' (' + user.email + ')'
            };
        });

        console.log('Users:', users);

        res.status(200).json(users);
    } catch (error) {
        console.error("Error in getUsers:", error.message);
        res.status(400).json({ message: error.message });
    }
};


function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}

module.exports.addUser = async (req, res) => {
    try {
        console.log("addUser");
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        // Find if the user already exists
        const users = await User.find({ email: email });
        console.log('Find user:', users);

        if (users.length > 0) {
            // If user already exists, return user data
            res.status(200).json({ '_id': users[0]._id, name, email, picture });
        } else {
            // If user does not exist, create a new user
            const newUser = new User({ "name": name, "email": email, "picture": picture });
            const newUserAdded = await newUser.save();
            console.log('New user added:', newUserAdded);
            res.status(200).json({ '_id': newUserAdded._id, name, email, picture });
        }
    } catch (error) {
        console.error("Error in addUser:", error.message);
        res.status(400).json({ message: 'Error in login' });
    }
};
