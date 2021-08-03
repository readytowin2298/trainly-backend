const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Quiz {

    static sqlToJs(obj){
        return obj;
    }
    // Get quizzes assigned to user
    static async getQuiz(id){
        try {
            const resp = await db.query(`SELECT * FROM quizzes WHERE id = $1`, [id]);
            return this.sqlToJs(resp.rows[0])
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    };

    static async createQuiz({ name, description, instructions }){
        try {
            const resp = await db.query(`INSERT INTO quizzes (name, description, instructions)
                VALUES ($1, $2, $3)
                RETURNING id, name, description, instructions`, 
                [name, description, instructions ? instructions : ""]);
            return this.sqlToJs(resp.rows[0]);

            
        } catch(err){
            throw new BadRequestError("Error communicating with database.")
        };
    };
}


module.exports =  Quiz;