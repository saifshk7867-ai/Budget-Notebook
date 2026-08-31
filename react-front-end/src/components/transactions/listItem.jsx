import React, { useState, useContext } from "react";
import axios from "axios";
import useVisualMode from '../../hooks/useVisualMode';
import dataContext from "../../context";
import { Button, TextField } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { green } from '@material-ui/core/colors';
import { red } from '@material-ui/core/colors';
import { TableCell, TableRow,Select,MenuItem } from "@material-ui/core";


export default function ListItem(props) {

  const { incomeTransactions, expenseTransactions,setState,incomeBudget,expenseBudget} = useContext(dataContext);
  if (!incomeTransactions.length || !expenseTransactions.length) {
    return null;
  }; 
  const SHOW = "SHOW";
  const EDIT = "EDIT";
  //function that transitions what is being displayed
  const { mode, transition} = useVisualMode(SHOW);

  const [name, setName] = useState(props.name || '');
  const [description, setDescription] = useState(props.description || '');
  const [amount, setAmount] = useState(props.amount || '');
  const [budget, setBudget] = useState(props.budgetId || 0);
  const [year,setYear]=useState(props.year || '');
  const [month,setMonth]=useState(props.month || '');
  const [day,setDay]=useState(props.day || '');

  //handles name state
  const dateHandler = function (event) {
    setYear(Number(event.target.value.slice(0, 4)));
    setMonth(Number(event.target.value.slice(5, 7)));
    setDay(Number(event.target.value.slice(-2)));
  };  

  //handles name state
  const nameHandler = function (event) {
    setName(event.target.value);
  };

  //handles description state
  const descriptionHandler = function (event) {
    setDescription(event.target.value);
  };

  //handles amount state
  const amountHandler = function (event) {
    setAmount(event.target.value);
  };

  const budgetHandler = function (event) {
    setBudget(event.target.value);
  };

  // Handles the deletion of a transaction and updates state
  const deletion = function (id, type) {
    axios.delete("/transactions/", { data: { id, type } })
      .then(() => {
        if (type === "income") {
          // creates a new income list with all items except the item being deleted
          const newIncomeTransactions = incomeTransactions.filter(item => item.id !== id);
          //updates state with new list
          setState(prev => ({
            ...prev,
            incomeTransactions: newIncomeTransactions
          }));
        } else if (type === "expense") {
          const newExpenseTransaction = expenseTransactions.filter(item => item.id !== id);
          setState(prev => ({
            ...prev,
            expenseTransactions: newExpenseTransaction
          }));
        };
      });
  };

   // Handles the edit request of an already existing transaction
   const handleEdit = (name, description, amount, month, day, year, id, type) => {
    axios.patch(`/transactions/`, { data: { name, description, amount, budget, month, day, year, id, type } })
      .then(() => {
        if (type === "income") {
          for (let i = 0; i < incomeTransactions.length; i++) {
            if (incomeTransactions[i].id === id) {
              const newItem = {
                ...incomeTransactions[i],
                name,
                description,
                amount,
                month,
                day,
                year,
                "income_budgets_id":budget
              }
              const newIncomeArray = incomeTransactions.map(item => {
                if (item.id === id) {
                  return newItem;
                }
                return item
              })
              setState(prev => ({
                ...prev,
                incomeTransactions: newIncomeArray
              }));
            }
          }
        } else if (type === "expense") {
          for (let i = 0; i < expenseTransactions.length; i++) {
            if (expenseTransactions[i].id === id) {
              const newItem = {
                ...expenseTransactions[i],
                name,
                description,
                amount,
                month,
                day,
                year,
                "expense_budgets_id":budget
              }
              const newExpenseArray = expenseTransactions.map(item => {
                if (item.id === id) {
                  return newItem;
                }
                return item
              })
              setState(prev => ({
                ...prev,
                expenseTransactions: newExpenseArray
              }));
            }
          }
        }
      });
  };

  //jsx to be returned when state is in SHOW
  const showItem = (
    mode === SHOW && (
         <TableRow key={props.id}>
         <TableCell>{props.year}-{props.month}-{props.day}</TableCell>
         <TableCell>{props.name}</TableCell>
         <TableCell>{props.description}</TableCell>
         <TableCell>${props.amount}</TableCell>
         <TableCell>{props.type==="income"?incomeBudget.find(e=>e.id===props.budgetId).name:expenseBudget.find(e=>e.id===props.budgetId).name}</TableCell>
         <TableCell>
         <IconButton aria-label="edit" style={{ marginRight: 15 }} fill="green" onClick={() => transition(EDIT)}>
           <EditIcon style={{ color: green[300] }} />
         </IconButton>
         </TableCell>
         <TableCell>
         <IconButton aria-label="delete" style={{ marginLeft: 15 }} fill="pink" onClick={() => deletion(props.id, props.type)}>
            <DeleteIcon style={{ color: red[300] }} />
        </IconButton>
         </TableCell>
         </TableRow>
    )
  );

  const editItem = (
    mode === EDIT && (
      <TableRow>
      <TableCell>
      <TextField
        margin="dense"
        id="date"
        label="Date"
        style={{ marginTop: 20 }}
        type="date"
        onChange={dateHandler}
        value={month<10 && day<10?`${year}-0${month}-0${day}`:(day>10?`${year}-0${month}-${day}`:`${year}-${month}-${day}`)}   
        />
      </TableCell>

      <TableCell >
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            onChange={nameHandler}
            value={name}
          />
      </TableCell>
      <TableCell>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            onChange={descriptionHandler}
            value={description}
          />
       </TableCell>
       <TableCell>
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Amount in dollars"
            type="number"
            onChange={amountHandler}
            value={amount}
          />
       </TableCell>
      <TableCell> 
      <Select          
          id="demo-simple-select"
          value={budget}
          onChange={budgetHandler}
        >
          {props.type==='income'?incomeBudget.map((e)=>{return(<MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)}):expenseBudget.map((e)=>{return(<MenuItem key={e.id} value={e.id}>{e.name}</MenuItem>)})} 
        </Select>
      </TableCell>
       <TableCell>  
          <Button
            onClick={() => {transition(SHOW);handleEdit(name, description, amount,month, day,year, props.id, props.type);}}
            variant="contained"
            color="primary"
            size="small"
            startIcon={<SaveIcon />}>Save</Button>
        </TableCell>
        <TableCell>
        <Button size="small" variant="outlined" color="default" onClick={() => transition(SHOW)}>Cancel</Button>
      </TableCell>
      </TableRow>
    )
  )

  return (
    <>
      {showItem}
      {editItem}
    </>
  );

}