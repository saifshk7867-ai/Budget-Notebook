const Express = require('express');
const db = require('./db/connection');
const BodyParser = require('body-parser');

const App = Express();
const PORT = 8080;

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(BodyParser.json());

// Routes
const transactions = require('./routes/transactions');
const dashboard = require('./routes/dashboards');
const budget = require('./routes/budgets');
const user = require('./routes/users');

App.use('/transactions', transactions);
App.use('/dashboards', dashboard);
App.use('/budgets', budget);
App.use('/users', user);

// Verify database connectivity before starting the server.
async function startServer() {
  try {
    await db.query('SELECT 1');

    console.log('Connected to PostgreSQL');

    App.listen(PORT, () => {
      console.log(`Express is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
