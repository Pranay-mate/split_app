const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        picture: {
            type: String,
            required: true
        },
        groups: {
            type: Array
        },
        group_requests:{
            type: Array
        }
    },{timestamps:true}
);

const users = mongoose.model('User', userSchema);

module.exports = users;