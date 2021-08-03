const express = require("express");
const jsonschema = require("jsonschema");
const { ensureCorrectUserOrAdmin, ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const Assignment = require('../models/assignment');
const { createToken } = require("../helpers/tokens");
const userNewSchema = require("../schemas/userNew.json");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();


router.get('/', ensureLoggedIn, async function (req, res, next){
    const assignments = await Assignment.getAssignments(res.locals.user.email);
    return res.json(assignments);
})


module.exports = router;