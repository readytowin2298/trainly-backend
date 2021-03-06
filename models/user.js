const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");

const {sqlForPartialUpdate} = require('../helpers/sql');
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");


class User {
    /** authenticate user with username, password.
     *
     * Returns { username, first_name, last_name, email, is_admin }
     *
     * Throws UnauthorizedError is user not found or wrong password.
     **/

    static sqlToJs(obj){
       if(obj.hasOwnProperty('isadmin')){
         obj['isAdmin'] = obj['isadmin'];
          delete obj['isadmin']
        }
      }
  
    static async authenticate(email, password) {
      // try to find the user first
      const result = await db.query(
            `SELECT email,
                    password,
                    name,
                    department,
                    position,
                    location,
                    isadmin
             FROM users
             WHERE email = $1`,
          [email],
      );
  
      const user = result.rows[0];
  
      if (user) {
        this.sqlToJs(user);
        // compare hashed password to a new hash from password
        const isValid = await bcrypt.compare(password, user.password);
        if (isValid === true) {
          delete user.password;
          return user;
        }
      }
  
      throw new UnauthorizedError("Invalid username/password");
    }
  
    /** Register user with data.
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws BadRequestError on duplicates.
     **/
  
    static async register(
        { email, password, name, department, position, location, isAdmin }) {
      const duplicateCheck = await db.query(
            `SELECT email
             FROM users
             WHERE email = $1`,
          [email],
      );
  
      if (duplicateCheck.rows[0]) {
        throw new BadRequestError(`Duplicate email: ${email}`);
      }
  
      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
  
      const result = await db.query(
            `INSERT INTO users
             (email,
              password,
              name,
              department,
              position,
              location,
              isadmin)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING email, name, department, position, location, isadmin`,
          [
            email,
            hashedPassword,
            name,
            department,
            position,
            location,
            isAdmin
          ],
      );
  
      const user = result.rows[0];
      this.sqlToJs(user);

      return user;
    }
  
    /** Find all users.
     *
     * Returns [{ username, first_name, last_name, email, is_admin }, ...]
     **/
  
    static async findAll() {
      const result = await db.query(
            `SELECT email, name, department, position, location, isadmin
             FROM users
             ORDER BY name`,
      );
      for(let row of result.rows){
        this.sqlToJs(row);
      }
      return result.rows;
    }
  
    /** Given a username, return data about user.
     *
     * Returns { username, first_name, last_name, is_admin, jobs }
     *   where jobs is { id, title, company_handle, company_name, state }
     *
     * Throws NotFoundError if user not found.
     **/
  
    static async get(email) {
      const userRes = await db.query(
            `SELECT email, name, department, position, location, isadmin
             FROM users
             WHERE email = $1`,
          [email],
      );
  
      const user = userRes.rows[0];
  
      if (!user) throw new NotFoundError(`No user: ${email}`);
      this.sqlToJs(user);
    //   const userApplicationsRes = await db.query(
    //         `SELECT a.job_id
    //          FROM applications AS a
    //          WHERE a.username = $1`, [username]);
  
    //   user.applications = userApplicationsRes.rows.map(a => a.job_id);
      return user;
    }
  
    /** Update user data with `data`.
     *
     * This is a "partial update" --- it's fine if data doesn't contain
     * all the fields; this only changes provided ones.
     *
     * Data can include:
     *   { firstName, lastName, password, email, isAdmin }
     *
     * Returns { username, firstName, lastName, email, isAdmin }
     *
     * Throws NotFoundError if not found.
     *
     * WARNING: this function can set a new password or make a user an admin.
     * Callers of this function must be certain they have validated inputs to this
     * or a serious security risks are opened.
     */


    static async update({email, password, name, department, location, position, isAdmin}){
        if(password){ password = await bcrypt.hash(password, BCRYPT_WORK_FACTOR) }

        const { setCols, values } = sqlForPartialUpdate(
          {email, password, name, department, location, position, isAdmin},
          { isAdmin : "isadmin" }
        )
        const usernameVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE email = ${usernameVarIdx} 
                      RETURNING email,
                                name,
                                department,
                                position,
                                location,
                                isadmin`;
        const result = await db.query(querySql, [...values, email]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${email}`);
        this.sqlToJs(user);
        return user;
    }
  
  
    /** Delete given user from database; returns undefined. */
  
    static async remove(email) {
      let result = await db.query(
            `DELETE
             FROM users
             WHERE email = $1
             RETURNING email`,
          [email],
      );
      const user = result.rows[0];
  
      if (!user) throw new NotFoundError(`No user: ${email}`);
    }
}
  
  
  module.exports = User;