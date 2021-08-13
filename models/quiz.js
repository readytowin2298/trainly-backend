const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const Question = require('./question');
const Answer = require('./answer');
const Assignment = require('./assignment');


class Quiz {

    static sqlToJs(obj){
        return obj;
    }
    // Get quizzes assigned to user
    static async getQuiz(quizId){
        try {
            const resp = await db.query(`SELECT * FROM quizzes WHERE id = $1`, [quizId]);
            const quiz = this.sqlToJs(resp.rows[0])
            quiz.questions = await Question.getQuestions(quizId);
            for(let question of quiz.questions){
                question.answers = await Answer.getAnswers(question.id);
            };
            return quiz;
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

    static async gradeQuiz({id, questions}, email){
        const quizId = req.params.quizId
        const assigned = await Assignment.checkAssigned(quizId, res.locals.user.email);
        if(!assigned || res.locals.user.isAdmin){
            throw new BadRequestError("You haven't been assigned this task")
        };
        let numCorrect = 0
        for(let question of questions){
            for(let answer of question.answers){
                if(answer.selected === true && answer.correct === true){
                    numCorrect += 1;
                }
            }
        }
        let score = Math.floor(numCorrect/questions.length);
        try{
            await db.query(`
            UPDATE assignments
            SET score = $1
            WHERE user_email = $2
            `, [score, email])
        } catch(err) {
            throw new BadRequestError("Error Communicating with Database")
        }

        return score;
    }
}


module.exports =  Quiz;