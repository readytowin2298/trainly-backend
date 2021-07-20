const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const Department = require("./department.js");
const {
commonBeforeAll,
commonBeforeEach,
commonAfterEach,
commonAfterAll,
testJobIds,
} = require("./_testCommon");
const { findAll } = require("./user");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


describe("get", ()=>{
    test("works", async ()=> {
        const department = await Department.get("t1");

        expect(department)
        expect(department).toHaveProperty("description", "Test Department")
    });
});
describe("register", ()=> {
    test("works", async ()=> {
        const department = await Department.register('ntd', "New Test Department");

        expect(department);
        const check = await db.query("SELECT * FROM departments WHERE department_code = 'ntd'");
        expect(check.rows.length).toEqual(1);
        expect(check.rows[0].description).toBe("New Test Department")
    })
    test("bad request with dup code", async ()=> {
        try {
            await Department.register('t1', 'something');
            fail();
        } catch(e){
            expect(e instanceof BadRequestError).toBeTruthy();
        }
    })
});
describe("update", ()=> {
    test("works", async ()=> {
        const department = await Department.update("t1", "Old Test Department");
        expect(department);
        const check = await Department.get("t1");
        expect(check.description).toBe("Old Test Department");
    })
});
describe("delete", ()=>{
    test("works", async ()=> {
        const description = await Department.delete("t1");
        expect(description)
    })
})