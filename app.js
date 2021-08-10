const express = require("express");


const app = express()

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const assignmentRoutes = require('./routes/assignments');
const quizRoutes = require('./routes/quizzes.js');
const cors = require("cors");
const morgan = require("morgan");



app.use(cors())
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);




app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/quizzes", quizRoutes);

app.get('/', function(req, res, next){
    res.send({message : 'Running Successfully'})
  })
  
/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});
  
  /** Generic error handler; anything unhandled goes here. */
  app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
});

module.exports = app;