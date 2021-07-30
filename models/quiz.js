const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");

class Quiz {
    // Get quizzes assigned to user
    static async getAssignments(email){
        const resp1 = await db.query(`SELECT * FROM assignments WHERE user_email = $1`, [email]);
        const assignments = resp1.rows;
        let quizzes = [];
        for(let assignment of assignemnts){
            let req = await db.query(`SELECT * FROM quizzes WHERE id = $1`, [assignment.task]);
            let quiz = req.rows[0];
            assignment.title = quiz.name;
            // assignment.description = 
        }
        return quizzes;
    }
}


module.exports =  Quiz;