
const mongoose = require('mongoose');

const groupSchema = mongoose.Schema(
    {
        group_name: {
            type: String,
            required: true
        },
        created_by: {
            type: String,
            required: true
        },
        members: {
            type: Array
        },
        request_pending: {
            type: Array
        }
    },{timestamps:true}
);

const groups = mongoose.model('Group', groupSchema);

module.exports = groups;