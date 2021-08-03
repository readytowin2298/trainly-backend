const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");


class Answer{

    static sqlToJs(obj){
        if(obj.hasOwnProperty('question_id')){
            obj['questionId'] = obj['question_id'];
             delete obj['question_id']
        };
        if(obj.hasOwnProperty('answer_text')){
            obj['answerText'] = obj['answer_text'];
             delete obj['answer_text']
        };
        return obj;
    };

    static async addAnswer({ questionId, answerText, correct }){
        try {
            const resp = await db.query(`INSERT INTO quiz_answers (question_id, answer_text, correct)
                VALUES ($1, $2, $3)
                RETURNING id, question_id, answer_text, correct`,
                [questionId, answerText, correct]);
            return resp.rows[0];
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    }
    static async getAnswer(id){
        try {
            const resp = await db.query(`SELECT * FROM quiz_answers WHERE id = $1`, [id]);
            return this.sqlToJs(resp.rows[0])
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    };
    static async getAnswers(questionId){
        try {
            const resp = await db.query(`SELECT * FROM quiz_answers WHERE question_id = $1`, [questionId]);
            return resp.rows.map((e) => this.sqlToJs(e));
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    };
};

module.exports = Answer;