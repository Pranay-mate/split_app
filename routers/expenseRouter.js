const express = require('express');
const { getExpenseCategory,addGroupExpense,getGroupExpenses,getAllGroupExpenses,getAllGroupExpenseDivsion,settleUpExpenseReq,receivedPayment ,getAllPayments}  = require('../controllers/expenseController');
const router = express.Router();

router.get('/getExpenseCategory', getExpenseCategory);
router.post('/addGroupExpense', addGroupExpense)
router.get('/getGroupExpenses/:grpId', getGroupExpenses)
router.get('/getAllGroupExpenses/:userId', getAllGroupExpenses)
router.get('/getAllGroupExpenseDivsion/:userId', getAllGroupExpenseDivsion)
router.get('/getAllPayments/:userId', getAllPayments)
router.post('/settleUpExpenseReq', settleUpExpenseReq)
router.post('/receivedPayment', receivedPayment)
module.exports =router;