const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testJobIds = [];

async function commonBeforeAll() {

  const password = await bcrypt.hash('password', BCRYPT_WORK_FACTOR)
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM departments");

  await db.query(`INSERT INTO departments 
        (department_code, description) VALUES
        ('t1', 'Test Department')`)

  await db.query(`
    INSERT INTO users (email, password, name, position, department, location, isadmin)
    VALUES ('test1', '${password}', 'tester1', 'clerk', 't1', 'hq', true),
    ('test2', '${password}', 'tester2', 'janitor', 't1', 'hq', false)`);

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
};