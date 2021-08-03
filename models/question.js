const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");


class Question{
    static sqlToJs(obj){
        if(obj.hasOwnProperty('quiz_id')){
            obj['quizId'] = obj['quiz_id'];
             delete obj['quiz_id']
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
        return obj;
    };
    static async addQuestion({quizId, questionNumber, linkToContent, questionText}){
        try {

            const resp = await db.query(`INSERT INTO quiz_questions (quiz_id, question_number, link_to_content, question_text)
                VALUES ($1, $2, $3, $4)
                RETURNING id, quiz_id, question_number, link_to_content, question_text`,
                [quizId, questionNumber, linkToContent, questionText]);
            return this.sqlToJs(resp.rows[0])
        } catch(err){
            throw new BadRequestError("Error communicating with database");
        };
    };
    static async getQuestion(id){
        try {
            const resp = await db.query(`SELECT * FROM quiz_questions WHERE id = $1`, [id]);
            return this.sqlToJs(resp.rows[0])
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    };
    static async getQuestions(quizId){
        try {
            const resp = await db.query(`SELECT * FROM quiz_questions WHERE id = $1`, [quizId]);
            return resp.rows.map((e) => this.sqlToJs(e));
        } catch(err){
            throw new BadRequestError("Error communicating with database")
        }
    };

};

module.exports = Question;