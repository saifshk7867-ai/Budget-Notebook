import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import FormDrawer from "./formDrawer";
import dataContext from "../../context";
import Graph from "./Graph";
import TransactionTab from "./transactionTab"
import { makeStyles,Paper } from "@material-ui/core";



const useStyles = makeStyles((theme) => ({
  mainPage: {
    display: "flex",
    justifyContent: "center",
    // position:"relative",
    // width:'80%'
  },
  paper: {
    textAlign: 'left',
    color: theme.palette.text.secondary,
    marginBottom: 50,
    marginTop: 25
  }
}));

export default function Transactions() {
  
  const [state, setState] = useState({
    incomeTransactions: [],
    expenseTransactions: [],
    expenseBudget: [],
    incomeBudget: []
  });

  const { month, year, userId } = useContext(dataContext);
  
  useEffect(() => {
    axios.get("/transactions", { params: { year, month, userId } })
      .then((res) => {
        setState((prev) => ({ ...prev, expenseTransactions: res.data.expenseInfo, incomeTransactions: res.data.incomeInfo, expenseBudget: res.data.expenseBudget, incomeBudget: res.data.incomeBudget }));
      });
  }, [month, year]);
    const classes = useStyles();

  return (
    <div className={classes.mainPage}>
      <dataContext.Provider value={{ incomeTransactions: state.incomeTransactions, expenseTransactions: state.expenseTransactions,setState,expenseBudget: state.expenseBudget, incomeBudget: state.incomeBudget,userId}}>
        
        <div>
        <Paper className={classes.paper} elevation={3}>
          <Graph />
        </Paper >
        <Paper className={classes.paper} elevation={3}>
          <TransactionTab />
        </Paper>
        </div>
        
        <FormDrawer/>
      </dataContext.Provider>
    </div>
  )

}