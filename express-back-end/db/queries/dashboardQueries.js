const db = require('../connection');

const createBalanceBudget = (amount, year, month, id) => {
  const queryStatement = `
  INSERT INTO balance_budgets (amount,year,month,user_id)
  VALUES ($1,$2,$3,$4)
  RETURNING *   
 `;
  return db.query(queryStatement, [amount, year, month, id])
    .then((response)=>{
      return response.rows[0];
    });
};


// Grab the balance budget from database for a specific user
const getBalanceBudgetByUserIdYear = (id, year) => {
  const queryStatement = `
  SELECT amount,month
  FROM balance_budgets
  WHERE user_id=$1
  AND year=$2
  `;
  return db.query(queryStatement, [id, year])
    .then((response) => {
      //if no balance budget has been set for some months, create a new balance budget entry with amount 0
      for (let i = 1; i <= 12; i++) {
  if (!response.rows.find(e => Number(e.month) === i)) {
    response.rows.push({ month: i, amount: 0 });
        }
      }
      return response.rows;
    })
    .catch(err => console.log(err));
};

// Grab the monthly income from database for a specific user
const getMonthlyIncomeByUserIdYear = (id, year) => {
  const queryStatement = `
  SELECT SUM(income.amount) AS monthly_income,month
  FROM income  
  WHERE income.user_id=$1 AND income.year=$2
  GROUP BY income.month
  `;
  return db.query(queryStatement, [id, year])
    .then((response) => {
      return response.rows;
    })
    .catch(err => console.log(err));
};

// Grab the monthly expense from database for a specific user
const getMonthlyExpenseByUserIdYear = (id, year) => {
  const queryStatement = `
  SELECT SUM(expense.amount) AS monthly_expense,month
  FROM expense  
  WHERE expense.user_id=$1 AND expense.year=$2
  GROUP BY expense.month
  `;
  return db.query(queryStatement, [id, year])
    .then((response) => {
      return response.rows;
    })
    .catch(err => console.log(err));
};

module.exports = {
  getBalanceBudgetByUserIdYear,
  getMonthlyIncomeByUserIdYear,
  getMonthlyExpenseByUserIdYear
};
