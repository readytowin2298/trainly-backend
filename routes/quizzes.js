const jsonschema = require("jsonschema");

const Quiz = require("../models/quiz");
const Assignment = require("../modesl/assignment");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

router.get('/:quizId', ensureLoggedIn, async function(req, res, next){
    try{
        const quizId = req.params.quizId
        const assigned = await Assignment.checkAssigned(quizId, res.locals.user.email);
        if(!assigned || res.locals.user.isAdmin){
            throw new BadRequestError("You haven't been assigned this task")
        }
        resp = await Quiz.getQuiz(quizId);
        return res.json(resp)
    } catch(err){
        return next(err)
    }
});

router.get(`/grade/:quizId`, ensureLoggedIn, async function(req, res, next){
    try{
        const quizId = req.params.quizId;
        const quiz = req.body;
    } catch(err){
        return next(err)
    }
})
module.exports =  router;