const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Department {
    static async get(department_code){
        const res = await db.query(`
            SELECT * FROM departments
            WHERE department_code = $1`, [department_code])

        return res.rows[0]
    }
    static async register(department_code, description){
        const check = await Department.get(department_code);
        if(!check){
            try {
                const res = await db.query(`
                INSERT INTO departments (department_code, description)
                VALUES ($1, $2)`, [department_code, description])
                return true
            } catch (e){
                throw new UnauthorizedError("Error syncing with database");
            }  
        }
        throw new BadRequestError("Department code must be unique")
    }
    static async update(department_code, description){
        try {
            const res = await db.query(`
            UPDATE departments 
            SET description = $2
            WHERE department_code = $1`, [department_code, description])
            return true
        } catch (e){
            throw new UnauthorizedError("Error syncing with database");
        }
    }
}



module.exports = Department;