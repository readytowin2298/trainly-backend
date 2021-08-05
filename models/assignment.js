const db = require("../db");
const bcrypt = require("bcrypt");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
  
const { BCRYPT_WORK_FACTOR } = require("../config.js");
const Quiz = require('./quiz');
const Answer = require('./answer');
const Question = require('./question')


class Assignment{
    static sqlToJs(obj){
        if(obj.hasOwnProperty('quiz_id')){
            obj['quizId'] = obj['quiz_id'];
             delete obj['quiz_id']
        };
        if(obj.hasOwnProperty('user_email')){
            obj['userEmail'] = obj['user_email'];
             delete obj['user_email']
        };
        return obj;
    };
    static async getAssignments(userEmail){
        try {
            const resp = await db.query(`SELECT * FROM assignments
                JOIN quizzes 
                ON assignments.quiz_id = quizzes.id
                WHERE assignments.user_email = $1`,
                [userEmail]);
            return resp.rows.map((a) => this.sqlToJs(a));
        } catch (err) {
            throw new BadRequestError("Error communicating with database.")
        }
    };
    static async getAssignment(assignment_id){
        try {
            const resp = await db.query(`SELECT * 
                FROM assignments 
                JOIN quizzes 
                ON assignments.quiz_id = quizzes.id 
                WHERE assignments.id = $1`,
                [assignment_id]);
            return resp.rows[0] ? this.sqlToJs(resp.rows[0]) : {"error" : "Not Found"};
        } catch (err) {
            throw new BadRequestError("Error communicating with database.")
        }
    };

};

module.exports = Assignment;