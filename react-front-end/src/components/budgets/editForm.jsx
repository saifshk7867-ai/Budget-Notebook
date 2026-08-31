import React, { useState, useContext } from 'react';
import axios from "axios";
import dataContext from "../../context.js";
import { Button, TextField,TableCell} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';


export default function EditForm(props) {

  const { incomeAndBudget, expenseAndBudget, balanceBudget, setState, month, year } = useContext(dataContext);

  const [formValue, setFormValue] = useState({
    name: props.item.name,
    amount: props.item.amount
  });
  const handleChange = (key, value) => {
    setFormValue(prev => ({
      ...prev,
      [key]: value
    }))
  };

  const handleSave = function () {
    axios.patch('/budgets', { data: { formValue, type: props.type, id: props.id, month, year, userId: 1 } })
      .then((resolve) => {

        if (props.type === 'income') {
          const newIncomeAndBudget = incomeAndBudget.map((e) => {
            if (e.id === props.id) {
              return {
                ...e,
                name: formValue.name,
                amount: formValue.amount
              }
            } else {
              return { ...e }
            }
          });
          setState((prev) => ({
            ...prev,
            incomeAndBudget: newIncomeAndBudget
          }));
        } else if (props.type === 'expense') {
          const newExpenseAndBudget = expenseAndBudget.map((e) => {
            if (e.id === props.id) {
              return {
                ...e,
                name: formValue.name,
                amount: formValue.amount
              }
            } else {
              return { ...e }
            }
          });
          setState((prev) => ({
            ...prev,
            expenseAndBudget: newExpenseAndBudget
          }));
        } else if (props.type === 'balance') {

          setState((prev) => ({
            ...prev,
            balanceBudget: [formValue.amount, ...balanceBudget.slice(1)]
          }));
        }
      })
      .then(() => {
        props.setEdit(0);

      })
  }

  return (
    <>

      <TableCell>
      <TextField
        autoFocus
        margin="dense"
        id="name"
        label="Name"
        type="text"
        onChange={(event) => handleChange("name", event.target.value)}
        value={formValue.name}
      />
     </TableCell>
     <TableCell>
      <TextField
        autoFocus
        margin="dense"
        id="amount"
        label="Amount"
        type="number"
        onChange={(event) => handleChange("amount", event.target.value)}
        value={formValue.amount}
      />
      </TableCell>
      <TableCell>
      <Button
        variant="contained"
        color="primary"
        size="small"     
        onClick={handleSave}
        startIcon={<SaveIcon />}
      >Save</Button>
      </TableCell>
      <TableCell>
      <Button
        variant="outlined"
        color="default"
        size="small" 
        onClick={() => { props.setEdit(0) }}
      >Cancel</Button>
      </TableCell>

    </>
  )


}