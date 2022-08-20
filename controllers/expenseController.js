const Expense = require('../models/expenseModel.js');
const Group = require('../models/groupModel.js');
const User = require('../models/userModel.js');


const mongoose = require('mongoose');
const { exit } = require('process');

module.exports.getExpenseCategory = async (req, res)=>{
    try {
        console.log("getExpense")
        // const { userId } = req.params;
        let expenses = await Expense.ExpenseCategory.find();
        // console.log("expenses"+ expenses)
        // if(expenses.length==0){
        //     let users = await Expense.ExpenseCategory.insertMany([{"group":"Entertainment",
        //     "key":"Games"},
        //     {"group":"Entertainment",
        //     "key":"Movies"},
        //     {"group":"Entertainment",
        //     "key":"Music"},
        //     {"group":"Entertainment",
        //     "key":"Sports"},
        //     {"group":"Food and drink",
        //     "key":"Dining out"},
        //     {"group":"Food and drink",
        //     "key":"Groceries"},
        //     {"group":"Food and drink",
        //     "key":"Liquor"},
        //     {"group":"Home",
        //     "key":"Electronics"},
        //     {"group":"Home",
        //     "key":"Furniture"},
        //     {"group":"Home",
        //     "key":"Household supplies"},
        //     {"group":"Home",
        //     "key":"Maintenance"},
        //     {"group":"Mortgage",
        //     "key":"Pets"},
        //     {"group":"Mortgage",
        //     "key":"Rent"},
        //     {"group":"Mortgage",
        //     "key":"Services"},
        //     {"group":"Life",
        //     "key":"Childcare"},
        //     {"group":"Life",
        //     "key":"Clothing"},
        //     {"group":"Life",
        //     "key":"Education"},
        //     {"group":"Life",
        //     "key":"Gifts"},
        //     {"group":"Life",
        //     "key":"Insurance"},
        //     {"group":"Life",
        //     "key":"Medical expenses"},
        //     {"group":"Life",
        //     "key":"Taxes"},
        //     {"group":"Transportation",
        //     "key":"Bicycle"},
        //     {"group":"Transportation",
        //     "key":"Bus/train"},
        //     {"group":"Transportation",
        //     "key":"Car"},
        //     {"group":"Transportation",
        //     "key":"Gas/fuel"},
        //     {"group":"Transportation",
        //     "key":"Hotel"},
        //     {"group":"Transportation",
        //     "key":"Parking"},
        //     {"group":"Transportation",
        //     "key":"Plane"},
        //     {"group":"Transportation",
        //     "key":"Taxi"},
        //     {"group":"Uncategorized",
        //     "key":"General"},
        //     {"group":"Utilities",
        //     "key":"Cleaning"},
        //     {"group":"Utilities",
        //     "key":"Electricity"},
        //     {"group":"Utilities",
        //     "key":"Heat/gas"},
        //     {"group":"Utilities",
        //     "key":"Trash"},
        //     {"group":"Utilities",
        //     "key":"TV/Phone/Internet"},
        //     {"group":"Utilities",
        //     "key":"Water"}]);
        // }

        // users = users.filter((user)=> user._id != userId)
        res.status(200).json(expenses);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports.getGroupExpenses = async (req,res)=>{
    try{
        console.log("getGroupExpenses")
        const { grpId } = req.params;
        let expenses = await Expense.GroupExpense.find({'groupId':grpId}).sort({'createdAt': -1});
        
        console.log("expenses"+ expenses)



        res.status(200).json(expenses);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports.getAllGroupExpenses = async (req,res)=>{
    try{
        console.log("getAllGroupExpenses")
        const { userId } = req.params;
        const userData = await User.findById(userId);
        
        let allGroupExpenses = [];
        for (let grpId of userData.groups) {
            let expense = await Expense.GroupExpense.find({'groupId':grpId}).sort({'createdAt': -1});
            if(expense.length>0){
                await allGroupExpenses.push(expense)
            }
        }
        res.status(200).json(allGroupExpenses);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports.getAllGroupExpenseDivsion = async (req,res)=>{
    try{
        console.log("getAllGroupExpenseDivsion")
        const { userId } = req.params;
        const userData = await User.findById(userId);
        
        let allGroupExpenses = [];
        let result = {};
        for (let grpId of userData.groups) {
            let expenses = await Expense.ExpenseDivision.find({'groupId':grpId,'expense':{ $ne: 0 }}).sort({"expense":-1});
            let groupDivision = [];
            
            if(expenses.length>0){
                left = 0;
                right = expenses.length-1
                // if(expenses[right].expense>=0){
                //     res.status(200).json([]);
                // }

                while(left<right){
                    console.log('left: '+left)
                    console.log('right: '+right)
                    //pay -> req pending -> confirmed
                    // let settleReq = await Expense.paymentSettle.find({'userId':userId});

                    if(expenses[left].expense+expenses[right].expense>0){
                        let limitOfLeft  = Math.abs(expenses[right].expense);
                        // groupDivision.push('left: '+expenses[left].userId+' will pay '+limitOfLeft+' to right:'+expenses[right].userId)
                        let status = await getStatusOfSettlement(grpId,expenses[right].userId,expenses[left].userId,limitOfLeft)
                        groupDivision.push({'id':expenses[left]._id,'sender':expenses[right].userId,'receiver':expenses[left].userId,'amount':limitOfLeft,'status':status})
                        let limitOfRight  = expenses[left].expense + expenses[right].expense;
                        expenses[left].expense= limitOfRight
                        expenses[right].expense=0
                        right--;
                    }else if(expenses[left].expense+expenses[right].expense<0){//100-200<0
                        let status = await getStatusOfSettlement(grpId,expenses[right].userId,expenses[left].userId,expenses[left].expense)
                        groupDivision.push({'id':expenses[left]._id,'sender':expenses[right].userId,'receiver':expenses[right].userId,'amount':expenses[left].expense,'status':status})
                        // groupDivision.push('left:'+expenses[left].userId+' will pay '+expenses[left].expense+' to right:'+expenses[right].userId)
                        let limitOfLeft = expenses[left].expense + expenses[right].expense;
                        expenses[left].expense=0
                        expenses[right].expense= limitOfLeft
                        console.log(limitOfLeft)
                        left++;
                    }else{
                        let status = await getStatusOfSettlement(grpId,expenses[right].userId,expenses[left].userId,expenses[left].expense)
                        groupDivision.push({'id':expenses[left]._id,'sender':expenses[right].userId,'receiver':expenses[left].userId,'amount':expenses[left].expense,'status':status})
                        // groupDivision.push('left:'+expenses[left].userId+' will pay '+expenses[left].expense+' to right:'+expenses[right].userId)
                        expenses[left].expense=0;
                        expenses[right].expense=0;
                        right--
                        left++
                    }

                }
             result[grpId] = groupDivision;
            }
        }
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports.addGroupExpense = async (req, res)=>{
    try {
        // console.log(req.body)
        let expenseData = req.body;
        expenseData.split_betn = getOnlyIds(expenseData.split_betn);
        // console.log(expenseData)

        const newGroupExpense = new Expense.GroupExpense(expenseData);
        const newGroupExpeneAdded = await newGroupExpense.save();

        for(let userId of expenseData.split_betn){
            let userExist = await Expense.ExpenseDivision.find({'groupId':expenseData.groupId,'userId':userId});
            console.log("userExist")
            // console.log(userExist[0].expense)
            let splitedAmount = parseInt(expenseData.expenseAmount)/parseInt(expenseData.per_person);
            
            if(userExist.length === 0 && expenseData.paid_by != userId){
                let newExpenseDivision = new Expense.ExpenseDivision({'groupId':expenseData.groupId,'userId':userId,'expense':-splitedAmount});
                let newExpenseDivisionAdded = await newExpenseDivision.save();
            }else if(userExist.length === 0 && expenseData.paid_by == userId){
                let newExpenseDivision = new Expense.ExpenseDivision({'groupId':expenseData.groupId,'userId':userId,'expense':expenseData.expenseAmount-splitedAmount});
                let newExpenseDivisionAdded = await newExpenseDivision.save();
            }
            else if(userExist.length > 0 && expenseData.paid_by != userId){
                let defaultAmount = parseInt(userExist[0].expense);
                let newExpenseDivision = await Expense.ExpenseDivision.updateOne({'groupId':expenseData.groupId,'userId':userId},{'expense':defaultAmount-splitedAmount})
            }else{
                let defaultAmount = parseInt(userExist[0].expense);
                let newExpenseDivision = await Expense.ExpenseDivision.updateOne({'groupId':expenseData.groupId,'userId':userId},{'expense':defaultAmount+(expenseData.expenseAmount-splitedAmount)});
            }

        }

        res.status(200).json(newGroupExpeneAdded);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

module.exports.settleUpExpenseReq = async (req,res)=>{
    try{
        console.log("settleUpExpenseReq")
        console.log(req.body)
        let paymentData = {'groupId':req.body.groupId,'userId':req.body.sender,"paid_to":req.body.receiver,'amount':req.body.amount,'isReq':true}
        const paymentReqAdded = new Expense.paymentSettle(paymentData);
        const requestAdded = await paymentReqAdded.save();
   
        res.status(200).json(requestAdded);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports.receivedPayment = async (req,res)=>{
    try{
        console.log("receivedPayment")
        console.log(req.body)
        let expenseData = await Expense.ExpenseDivision.findById(req.body.expenseId);
        let amount = await expenseData.expense-parseInt(req.body.amount)
        let expense = await Expense.ExpenseDivision.findByIdAndUpdate(req.body.expenseId,{'expense':amount});
        let expenseDataSender = await Expense.ExpenseDivision.findOne({'groupId':req.body.groupId,'userId':req.body.sender,'amount':Math.abs(parseInt(req.body.amount))});
        let amountSender = await parseInt(req.body.amount)+parseInt(expenseDataSender.expense)
        // console.log(req.body.amount)
        console.log(amountSender)
        let expenseSender = await Expense.ExpenseDivision.findByIdAndUpdate(expenseDataSender._id,{'expense':amountSender});

        let paymentData = {'groupId':req.body.groupId,'userId':req.body.sender,"paid_to":req.body.receiver,'amount':parseInt(req.body.amount)}
        const receivedPayment = await Expense.paymentSettle.findOneAndUpdate(paymentData,{'isConfirmed':true});
   
        res.status(200).json(receivedPayment);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

module.exports.getAllPayments = async (req,res)=>{
    try{
        console.log("getAllPayments")
        const { userId } = req.params;
        console.log(req.body)
        let paymentsData = await Expense.paymentSettle.find({ $or: [ { 'userId': userId}, { 'paid_to': userId} ] });

        let result = {};
        let paymentGroup = [];
        if(paymentsData.length>0){
            let grpId = paymentsData[0].groupId;
            paymentsData.forEach((payment,i)=>{
                if(grpId === payment.groupId){
                    paymentGroup.push(payment)
                }else{
                    result[grpId] = paymentGroup;
                    paymentGroup = [];
                    grpId = payment.groupId;
                    paymentGroup.push(payment)
                }
            })
            if(paymentGroup.length>0){
                result[grpId] = paymentGroup;
            }
        }
        
        
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({message: error.message});
    }
}

function getOnlyIds(array){
    array.forEach((element,id) => {
        element = Object.keys(element).reduce(function(obj, key) {
            if (key == "_id") {           //key you want to remove
              obj[key] = element[key];
            }
            return obj;
        }, []);
        array[id]=element._id
    });

    return array;
}

 getStatusOfSettlement = async (grpId,sender,receiver,amount)=>{
    console.log(grpId,sender,receiver,amount)
    let settleReqData = await Expense.paymentSettle.find({'groupId':grpId,'userId':sender,'paid_to':receiver,'amount':parseInt(amount)});
    console.log(settleReqData)
    if(settleReqData.length>0){
        if(settleReqData[0].isReq && settleReqData[0].isConfirmed){
            return 'Settled';
        }else if(settleReqData[0].isReq && !settleReqData[0].isConfirmed){
            return 'Pending';
        }else if(!settleReqData[0].isReq && !settleReqData[0].isConfirmed){
            return 'Pay';
        }
    }else{
        return 'Pay';
    }
    return 'Pay';
}