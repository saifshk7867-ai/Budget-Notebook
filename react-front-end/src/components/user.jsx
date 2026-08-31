import React, { useContext, useState } from "react"
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import dataContext from "../context.js";
import { TextField, Button, Grid, Link, AppBar, Toolbar, Typography } from '@material-ui/core/'
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    marginTop: "100px"
  },
  input: {
    marginTop: "10px",
    marginBottom: "10px",
    width: "500px"
  },
  button: {
    margin: theme.spacing(1, 0, 2),
  },
  appBar: {
    background: "#64b5f6"
  },
  toolbar: theme.mixins.toolbar,
}));

export default function User() {
  const classes = useStyles();
  const history = useHistory();

  const { userId,setUserId } = useContext(dataContext);

  if(userId){
    history.push('/dashboards');
  }

  const [err, setErr] = useState(false);

  const [formValue, setFormValue] = useState({
    email: "",
    password: ""
  });

  const handleChange = (key, value) => {
    setFormValue(prev => ({ ...prev, [key]: value }))
  };

  const handleSubmit = () => {
    axios.post('/users', { data: formValue })
      .then((res) => {
        if (res.data) {
          setUserId(res.data.id);
          history.push('/dashboards');
        } else {
          setErr("Incorrect Password.")
        }
      })
  };


  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolWrapper}>
          <Typography variant="h6" className={classes.title}>
            Budget Notebook
          </Typography>
        </Toolbar>
      </AppBar>

      <form noValidate autoComplete="off" className={classes.form}>
        <TextField
          className={classes.input}
          label="Email"
          variant="outlined"
          autoFocus
          value={formValue.email}
          onChange={(event) => { handleChange('email', event.target.value) }}
        />
        <TextField
          error={err ? true : false}
          className={classes.input}
          label="Password"
          helperText={err}
          variant="outlined"
          value={formValue.password}
          onChange={(event) => { handleChange('password', event.target.value) }}
        />
        <Button onClick={handleSubmit} color="primary" variant="contained" className={classes.button}>
          Sign In
        </Button >
        <Grid container>
          <Grid item xs>
            <Link href="#" variant="body2">
              <div style={{ color: 'rgb(63,81,181)', marginTop: '10px' }}>Forgot password?</div>
            </Link>
          </Grid>
          <Grid item>
            <Link href="#" variant="body2">
              <div style={{ color: 'rgb(63,81,181)', marginTop: '10px' }}>Sign Up</div>
            </Link>
          </Grid>
        </Grid>

      </form>

    </>
  )
};


