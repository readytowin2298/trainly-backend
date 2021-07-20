const db = require("../db.js");
const User = require("../models/user");
const department = require("../models/department");
const { createToken } = require("../helpers/tokens");
const Department = require("../models/department");
const {BCRYPT_WORK_FACTOR} = require('../config');
const bcrypt = require('bcrypt')

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM departments");

  const password = await bcrypt.hash('password', BCRYPT_WORK_FACTOR);
  await Department.register('td1', 'First Test Department');
  await Department.register('td2', 'Second Test Department');
  await db.query(`
    INSERT INTO users (email, password, name, position, department, location, isadmin)
    VALUES ('test1', '${password}', 'tester1', 'clerk', 'td1', 'hq', true),
    ('test2', '${password}', 'tester2', 'janitor', 'td2', 'hq', false)`);

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM departments");
  await db.end();
}


const test1Token = createToken({ username: "test1", isAdmin: true });
const test2 = createToken({ username: "test2", isAdmin: false });


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  test1Token,
  test2,
};