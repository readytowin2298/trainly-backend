const jsonschema = require("jsonschema");

const Quiz = require("../models/quiz");
const express = require("express");
const router = new express.Router();
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");

router.get('/:quizId', ensureLoggedIn, async function(req, res, next){
    try{
        resp = await Quiz.getQuiz(req.params.quizId);
        return res.json(resp)
    } catch(err){
        return next(err)
    }
});


module.exports =  router;