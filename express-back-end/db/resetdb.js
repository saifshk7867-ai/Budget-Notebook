require('dotenv').config();

const fs = require('fs');
const chalk = require('chalk');
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?sslmode=disable`;

const client = new Client({
  connectionString
});

const runSchemaFiles = async function () {
  console.log(chalk.cyan(`-> Loading Schema Files ...`));
  const schemaFilenames = fs.readdirSync('./db/schema');

  for (const fn of schemaFilenames) {
    const sql = fs.readFileSync(`./db/schema/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await client.query(sql);
  }
};

const runSeedFiles = async function () {
  console.log(chalk.cyan(`-> Loading Seeds ...`));
  const seedFilenames = fs.readdirSync('./db/seeds');

  for (const fn of seedFilenames) {
    const sql = fs.readFileSync(`./db/seeds/${fn}`, 'utf8');
    console.log(`\t-> Running ${chalk.green(fn)}`);
    await client.query(sql);
  }
};

async function resetDatabase() {
  try {
    console.log(`-> Connecting to PG using ${connectionString} ...`);

    await client.connect();

    await runSchemaFiles();
    await runSeedFiles();

    console.log(chalk.green('-> Database reset completed successfully.'));
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

resetDatabase();
