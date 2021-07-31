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
        const resp = await db.query(`SELECT assignments.id AS assignment_id,
            quizzes.id AS quiz_id,
            user_email,
            name,
            description,
            instructions,
            completed,
            score
            FROM assignments 
            JOIN quizzes 
            ON assignments.quiz_id = quizzes.id 
            WHERE user_email = $1`, [email]);
        const assignments = resp.rows;
        let quizzes = [];
        for(let assignment of assignments){
            let req = await db.query(`SELECT * FROM quiz_questions WHERE quiz_id = $1`, [assignment.quiz_id]);
            let num_questions = req.rows.length;
            assignment.num_questions = num_questions;
        }
        return assignments;
    };

    static async createQuiz({ name, description, instructions }){
        if(!name || !description ){
            throw new BadRequestError("Must include name and description")
        }
        let resp;
        try {
            resp = await db.query(`INSERT INTO quizzes (name, description, instructions)
                VALUES ($1, $2, $3)
                RETURNING id, name, description, instructions`, 
                [name, description, instructions ? instructions : ""]);
            
        } catch(err){
            throw new BadRequestError("Error communicating with database.")
        };
        return resp.rows[0]
    }
}


module.exports =  Quiz;