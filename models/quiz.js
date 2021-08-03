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
        if(obj.hasOwnProperty('isadmin')){
            obj['isAdmin'] = obj['isadmin'];
                delete obj['isadmin']
        };
        if(obj.hasOwnProperty('quiz_id')){
            obj['quizId'] = obj['quiz_id'];
             delete obj['quiz_id']
        };
        if(obj.hasOwnProperty('user_email')){
            obj['userEmail'] = obj['user_email'];
             delete obj['user_email']
        };
        if(obj.hasOwnProperty('question_number')){
            obj['questionNumber'] = obj['question_number'];
             delete obj['question_number']
        };
        if(obj.hasOwnProperty('link_to_content')){
            obj['linkToContent'] = obj['link_to_content'];
             delete obj['link_to_content']
        };
        if(obj.hasOwnProperty('question_text')){
            obj['questionText'] = obj['question_text'];
             delete obj['question_text']
        };
        if(obj.hasOwnProperty('question_id')){
            obj['questionId'] = obj['question_id'];
             delete obj['question_id']
        };
        if(obj.hasOwnProperty('answer_text')){
            obj['answerText'] = obj['answer_text'];
             delete obj['answer_text']
        };
        return obj;
    }
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
            this.sqlToJs(assignment);
            assignment.num_questions = numQuestions;
        }
        return assignments;
    };

    static async createQuiz({ name, description, instructions }){
        try {
            const resp = await db.query(`INSERT INTO quizzes (name, description, instructions)
                VALUES ($1, $2, $3)
                RETURNING id, name, description, instructions`, 
                [name, description, instructions ? instructions : ""]);
            return resp.rows[0];

            
        } catch(err){
            throw new BadRequestError("Error communicating with database.")
        };
    };
    static async addQuestion({quiz_id, question_num, link_to_content, question_text}){
        try {
            const resp = await db.query(`INSERT INTO quiz_questions (quiz_id, question_num, link_to_content, question_text)
                VALUES ($1, $2, $3, $4)
                RETURNING id, quiz_id, question_num, link_to_content, question_text`,
                [quiz_id, question_num, link_to_content, question_text])
        } catch(err){
            throw new BadRequestError("Error communicating with database");
        }
    }
}


module.exports =  Quiz;