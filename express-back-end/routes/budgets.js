const Express = require('express');
const router = Express.Router();
const budgetQueries = require('../db/queries/budgetQueries');


router.get('/', (req, res) => {
  const budgetData = {};
  const userId = req.query.userId;
	  const monthParam = req.query.month;
  const yearParam = req.query.year;
  const month = Number(monthParam);
  const year = Number(yearParam);

  if (
    !userId ||
    monthParam === undefined ||
    yearParam === undefined ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12 ||
    !Number.isInteger(year) ||
    year < 1900 ||
    year > 9999
  ) {
    return res.status(400).json({
      error: 'userId, a valid month, and a valid year are required'
    });
  }

   Promise.all([
    budgetQueries.getIncomeAndBudget(userId, month, year),
    budgetQueries.getExpenseAndBudget(userId, month, year),
    budgetQueries.getBalanceBudget(userId, month, year)
  ])
    .then((all) => {
      //if the selected month has no budget, assign sum and amount as 0, to avoid incomeAndBudget is undefined
      if (!all[0].length) {
      // eslint-disable-next-line camelcase
        all[0] = [{income_sum:0,id:0,amount:0,name:"",year:req.query.year,month:req.query.month,user_id:userId}];
      }
      budgetData.incomeAndBudget = all[0];
      //if the selected month has no budget, assign sum and amount as 0, to avoid expenseAndBudget is undefined
      if (!all[1].length) {
        // eslint-disable-next-line camelcase
        all[1] = [{expense_sum:0,id:0,amount:0,name:"",year:req.query.year,month:req.query.month,user_id:userId}];
      }
      budgetData.expenseAndBudget = all[1];

      budgetData.balanceBudget = all[2].map(e=>!e.amount ? 0 : e.amount);

    })
    .then(()=>res.json(budgetData));
});


router.post('/', (req, res) => {
  const {name,amount,month,year,userId} = req.body.data.formValue;

  const {tabType} = req.body.data;

  if (tabType === 0) {
    budgetQueries.createIncomeBudget(name,amount,year,month,userId)
      .then(resolve=>{
        budgetQueries.createIncome(year,month,userId,resolve);
        res.json(resolve);
      });
  } else if (tabType === 1) {
    budgetQueries.createExpenseBudget(name,amount,year,month,userId)
      .then(resolve=>{
        budgetQueries.createExpense(year,month,userId,resolve);
        res.json(resolve);
      });
  }
});

router.patch('/', (req, res) => {

  const {type,id,month,year,userId} = req.body.data;
  const {name,amount} = req.body.data.formValue;
  
  if (type === 'income') {
    budgetQueries.updateIncomeBudget(id,amount,name)
      .then((resolve)=>{
        res.json(resolve);
      });

  } else if (type === 'expense') {
    budgetQueries.updateExpenseBudget(id,amount,name)
      .then((resolve)=>{
        res.json(resolve);
      });
  } else if (type === 'balance') {
   
    budgetQueries.updateBalanceBudget(month,year,amount,userId)
      .then((resolve)=>{
        res.json(resolve);
      });
  }
});

router.delete('/', (req, res) => {

  const {id,budgetType} = req.body;
  
  if (budgetType === 'expense') {
    budgetQueries.deleteExpenseBudget(id);
  } else if (budgetType === 'income') {
    budgetQueries.deleteIncomeBudget(id);
  }
});

module.exports = router;

