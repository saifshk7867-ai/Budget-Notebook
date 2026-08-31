const Express = require('express');
const router = Express.Router();
const dashBoardQueries = require('../db/queries/dashboardQueries');

router.get('/', (req, res) => {
  const dashboardData = {};
  const userId = req.query.userId;
  const year = Number(req.query.year);

if (!userId || !year) {
  return res.status(400).json({
    error: 'userId and year are required'
  });
}  
  Promise.all([
  dashBoardQueries.getBalanceBudgetByUserIdYear(userId, year),
  dashBoardQueries.getMonthlyIncomeByUserIdYear(userId, year),
  dashBoardQueries.getMonthlyExpenseByUserIdYear(userId, year)

  ])
    .then((all) => {
      dashboardData.balanceBudget = all[0];

      //Fill monthly_income for the months with no data
      for (let i = 1; i <= 12; i++) {
        if (!all[1].find(e => e.month === i)) {
          // eslint-disable-next-line camelcase
          all[1].push({ monthly_income: 0, month: i });
        }
      }
      dashboardData.monthlyIncome = all[1];
      const incomeArr = all[1].map(e => Number(e.monthly_income));
      dashboardData.annualIncome = incomeArr.length !== 0 ? incomeArr.reduce((a, b) => a + b).toFixed(2) : 0;

      //Fill monthly_expense for the months with no data
      for (let i = 1; i <= 12; i++) {
        if (!all[2].find(e => e.month === i)) {
          // eslint-disable-next-line camelcase
          all[2].push({ monthly_expense: 0, month: i });
        }
      }
      dashboardData.monthlyExpense = all[2];
      const expenseArr = all[2].map(e => Number(e.monthly_expense));
      dashboardData.annualExpense = expenseArr.length !== 0 ? expenseArr.reduce((a, b) => a + b).toFixed(2) : 0;
    })
    .then(()=>res.json(dashboardData));

});
module.exports = router;
