const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 16;
const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
const PORT = +process.env.PORT || 3001;
require("colors");

function getDatabaseUri() {
    return (process.env.NODE_ENV === "test")
        ? "trainly_test"
        : process.env.DATABASE_URL || "trainly";
}

console.log("Trainly Config:".green);
console.log("SECRET_KEY:".yellow, SECRET_KEY);
console.log("PORT:".yellow, PORT.toString());
console.log("BCRYPT_WORK_FACTOR".yellow, BCRYPT_WORK_FACTOR);
console.log("Database:".yellow, getDatabaseUri());
console.log("---");

module.exports = {
    BCRYPT_WORK_FACTOR,
    SECRET_KEY,
    PORT,
    getDatabaseUri
}