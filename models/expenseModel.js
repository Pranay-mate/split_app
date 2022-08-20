
const mongoose = require('mongoose');

const expenseCategorySchema = mongoose.Schema(
    {
        group: {
            type: String,
            required: true
        },
        key: {
            type: String,
            required: true
        }
    }
);

const GroupExpenseSchema = mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true
        },
        expenseCategory: {
            type: String,
            required: true
        },
        expenseDescription: {
            type: String,
            required: true
        },
        expenseAmount: {
            type: Number,
            required: true
        },
        paid_by:{
            type: String,
            required: true
        },
        split_betn:{
            type:Array,
            required:true
        },
        per_person:{
            type:Number,
            required:true
        },
        created_by:{
            type: String
        },
        updated_by:{
            type: String
        }

    },{timestamps:true}
);


const expenseDivisionSchema = mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        expense:{
            type: Number,
            required: true
        }
    }
);

const paymentSettleSchema = mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
        paid_to:{

        },
        amount:{
            type:Number,
            required:true
        },
        isReq:{
            type:Boolean,
            default:false
        },
        isConfirmed:{
            type:Boolean,
            default:false
        }
    },{timestamps:true}
);

module.exports.ExpenseCategory = mongoose.model('expenseCategory', expenseCategorySchema)
module.exports.GroupExpense = mongoose.model('groupExpense', GroupExpenseSchema)
module.exports.ExpenseDivision = mongoose.model('expenseDivision', expenseDivisionSchema)
module.exports.paymentSettle = mongoose.model('paymentSettle', paymentSettleSchema)