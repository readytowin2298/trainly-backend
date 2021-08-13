const express = require("express");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError, UnauthorizedError } = require("../expressError");
const User = require("../models/user");
const Assignment = require('../models/assignment');
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


router.get('/', ensureLoggedIn, async function (req, res, next){
    try {
        const assignments = await Assignment.getAssignments(res.locals.user.email);
        return res.json(assignments);
    } catch (err) {
        return next(err)
    }
});

router.get('/:assignment_id', ensureLoggedIn, async function (req, res, next){
    try {
        const assignment = await Assignment.getAssignment(req.params.assignment_id);
        if(assignment.userEmail !== res.locals.user.email && !res.locals.user.isAdmin){
            throw new UnauthorizedError("You are unauthroized to access this data")
        };
        return res.json(assignment);
    } catch (err) {
        return next(err);
    };
});


module.exports = router;