const express = require("express");


const app = express()

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");

app.use(authenticateJWT);
app.use(express.json());


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