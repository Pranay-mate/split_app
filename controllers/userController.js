const User = require('../models/userModel.js');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

const mongoose = require('mongoose');
// var moment = require('moment');

// module.exports.getLoginUser = async (req, res)=>{
//     const { userId } = req.params;
//     try {
//         const user= await User.findById(userId);
//         console.log(user)

//         res.status(200).json(user);
//     } catch (error) {
//         res.status(400).json({message: error.message});
//     }
// }

module.exports.getUsers = async (req, res)=>{
    try {
        const { userId } = req.params;
        let users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

function upsert(array, item) {
    const i = array.findIndex((_item) => _item.email === item.email);
    if (i > -1) array[i] = item;
    else array.push(item);
}

module.exports.addUser = async  (req,res)=>{
    try{
        const { token } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        });
  
        const { name, email, picture } = ticket.getPayload();
        // console.log(ticket.getPayload()) 
        // console.log(name,email,picture) 

        //find
        const users = await User.find({email:email});
        console.log('find :'+users)

        if(users.length>0){
            res.status(200).json({ '_id': users[0]._id, name, email, picture });
        }else{
            // insert
            const newUser = new User({"name":name,"email":email,"picture":picture});
            const newUserAdded = await newUser.save();
            console.log('newUserAdded: '+newUserAdded)
            // console.log(name)
            res.status(200).json({ '_id':newUserAdded._id, name,email,picture });
        }
       
    }catch(error){
        res.status(200).json({ message: 'Error in login'});
    }
}
