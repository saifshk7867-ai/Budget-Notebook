const Express = require('express');
const db = require('./db/connection');
const BodyParser = require('body-parser');

const App = Express();
const PORT = 8080;

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

//Set up db connection
db.connect();

const transactions = require('./routes/transactions');
const dashboard = require('./routes/dashboards');
const budget = require('./routes/budgets');
const user = require('./routes/users');

App.use('/transactions', transactions);
App.use('/dashboards', dashboard);
App.use('/budgets', budget);
App.use('/users', user);

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express seems to be listening on port ${PORT} so that's pretty good 👍`);
});
