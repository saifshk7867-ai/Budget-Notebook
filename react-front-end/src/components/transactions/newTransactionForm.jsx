import React from 'react';
import { useState,useContext } from 'react';
import axios from 'axios';
import dataContext from '../../context';
import { TextField, Button, Radio, RadioGroup, makeStyles,FormControlLabel,InputLabel,MenuItem,FormControl, Select } from '@material-ui/core';


const useStyles = makeStyles({
  transactionForm: {
    borderStyle: "solid",
    borderColor: "#64b5f6",
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: "#fff",
    width: 400,
    margin: 50,
    padding:50
  },

  dateInput: {
    width: 260
  }
});

export default function NewTransactionForm(props) {
  const classes = useStyles();
  const { incomeBudget, expenseBudget,userId,incomeTransactions,expenseTransactions,setState } = useContext(dataContext);
  const [type, setType] = useState('income');
  if (!incomeBudget.length || !expenseBudget.length) {
    return null;
  };
  const [formValue, setFormValue] = useState({
    name: "",
    description: "",
    amount: 0,
    date: `${new Date().getFullYear()}-${new Date().getMonth()<10?'0'+(new Date().getMonth()+1):new Date().getMonth()}-${new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()}`,
    year: 0,
    month: 0,
    day: 0,
    selectedBudgetId: '',
    "userId": userId
  });

  const handleChange = (key, value) => {
    setFormValue(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const selectorList = (type) => {
    if (type === "income") {
      return incomeBudget.map(e => {
        return (
          <MenuItem value={e.id} key={e.id}>{e.name}</MenuItem>
        );
      });
    } else if (type === "expense") {
      return expenseBudget.map(e => {
        return (
          <MenuItem value={e.id} key={e.id}>{e.name}</MenuItem>
        );
      });
    };
  };

  const handleSubmit = (type) => {
    formValue.year = Number(formValue.date.slice(0, 4));
    formValue.month = Number(formValue.date.slice(5, 7));
    formValue.day = Number(formValue.date.slice(-2));
    axios.post(`/transactions/`, { data: { type, formValue } })
      .then((res) => {
        if (type === "income") {
          const newIncomeTransactions = [...incomeTransactions,
            {name: formValue.name,
            description: formValue.description,
            amount: formValue.amount,
            month: formValue.month,
            day: formValue.day,
            year: formValue.year,
            id: res.data,
            income_budgets_id: formValue.selectedBudgetId}];

          setState((prev)=>({...prev,incomeTransactions:newIncomeTransactions}));
        } else if (type === "expense") {
          const newExpenseTransactions = [...expenseTransactions,
            {name: formValue.name,
            description: formValue.description,
            amount: formValue.amount,
            month: formValue.month,
            day: formValue.day,
            year: formValue.year,
            id: res.data,
            expense_budgets_id: formValue.selectedBudgetId}];

          setState((prev)=>({...prev,expenseTransactions:newExpenseTransactions}));
        }
      })
      .then(() => {
        setFormValue({
          name: "",
          description: "",
          amount: 0,
          date: `${new Date().getFullYear()}-${new Date().getMonth()<10?'0'+(new Date().getMonth()+1):new Date().getMonth()}-${new Date().getDate()<10?'0'+new Date().getDate():new Date().getDate()}`,
          year: 0,
          month: 0,
          day: 0,
          selectedBudgetId: '',
          "userId": userId
        });
      })
      .catch(err => console.log(err));
  };

  return  (

      <div className={classes.transactionForm}>
        <h3 className='transaction-form-title'>New Transaction</h3>
   
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Title"
              type="text"
              onChange={(event) => handleChange("name", event.target.value)}
              value={formValue.name}
            />
          </div>
          <div>
            <TextField
              margin="dense"
              id="description"
              label="Description"
              type="text"
              onChange={(event) => handleChange("description", event.target.value)}
              value={formValue.description}
            />
          </div>
          <div>
            <TextField   
              margin="dense"
              id="amount"
              label="Amount"
              type="number"
              onChange={(event) => handleChange("amount", event.target.value)}
              value={formValue.amount}
            />
          </div>
   
     
          <RadioGroup row aria-label="transactionsType" style={{ paddingTop: 15 }} name="transaction" value={type} onChange={handleTypeChange}>
            <FormControlLabel value="income" control={<Radio />} label="Income" />
            <FormControlLabel value="expense" control={<Radio />} label="Expense" />
          </RadioGroup>
          <TextField
            className={classes.dateInput}
            margin="dense"
            id="date"
            style={{ marginTop: 20 }}
            type="date"
            onChange={(event) => handleChange("date", event.target.value)}
            value={formValue.date}
          />
          <FormControl style={{ width: 270 }}>
            <InputLabel id="demo-simple-select-label"
              style={{ height: 45 }}>Budget</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formValue.selectedBudgetId}
              onChange={(event) => handleChange("selectedBudgetId", event.target.value) }
            >
              {selectorList(type)}

            </Select>
          </FormControl>

          <div className="transaction-form-btn">
            <Button onClick={() => {handleSubmit(type);props.setOpen(false);} } color="primary" variant="contained">
              Submit
            </Button>
  
            <Button onClick={()=>props.setOpen(false)} color="default" >
              Cancel
            </Button>
          </div>
        </div>

    );
};