const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
  } = require("../expressError");
  const db = require("../db.js");
  const User = require("./user.js");
  const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    testJobIds,
  } = require("./_testCommon");
  
  beforeAll(commonBeforeAll);
  beforeEach(commonBeforeEach);
  afterEach(commonAfterEach);
  afterAll(commonAfterAll);
  
  /************************************** authenticate */
  
  describe("authenticate", function () {
    test("works", async function () {
      const user = await User.authenticate("test1", "password");
        expect(user)
    //   expect(user).toHaveProperty('email', 'test1')
    //   expect(user).toHaveProperty('isAdmin', true)
    });
  
    test("unauth if no such user", async function () {
      try {
        await User.authenticate("nope", "password");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  
    test("unauth if wrong password", async function () {
      try {
        await User.authenticate("c1", "wrong");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  });
  
  /************************************** register */
  
  describe("register", function () {
    const newUser = {
      email: "test@test.com",
      password: "test",
      name: "tester",
      location: "hq",
      position: "testing specialist",
      isAdmin: false
    };
  
    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
      });
      expect(user)
      const found = await db.query("SELECT * FROM users WHERE email = 'test@test.com'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].isadmin).toEqual(false);
    });
  
    test("works: adds admin", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
        isAdmin: true,
      });
      const found = await db.query("SELECT * FROM users WHERE email = 'test@test.com'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].isadmin).toEqual(true);
    });
  
    test("bad request with dup data", async function () {
      try {
        await User.register({
          ...newUser,
          password: "password",
        });
        await User.register({
          ...newUser,
          password: "password",
        });
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  
//   /************************************** findAll */
  
  describe("findAll", function () {
    test("works", async function () {
      const users = await User.findAll();
      expect(users[0]).toEqual(
        {
          email: "test1",
          name: "tester1",
          position: "clerk",
          department: "t1",
          location: "hq",
          isAdmin: true,
        }
      );
    });
  });
  
//   /************************************** get */
  
  describe("get", function () {
    test("works", async function () {
      let user = await User.get("test1");
      expect(user).toEqual({
        email: "test1",
          name: "tester1",
          position: "clerk",
          department: "t1",
          location: "hq",
          isAdmin: true,
      });
    });
  
    test("not found if no such user", async function () {
      try {
        await User.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
  
//   /************************************** update */
  
  describe("update", function () {
    const updateData = {
      email: "test1",
      name: "somethingElse"
    };
  
    test("works", async function () {
      let job = await User.update(updateData);
      expect(job);
      expect(job).toHaveProperty("name", "somethingElse")
    });
  
    test("works: set password", async function () {
      let job = await User.update({
        email: "test2",
        password: "new",
      });
      expect(job);
      const found = await db.query("SELECT * FROM users WHERE email = 'test2'");
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });
  
    test("not found if no such user", async function () {
      try {
        await User.update({
          email: "email",
          location: "goodbye"
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  
    test("bad request if no data", async function () {
      expect.assertions(1);
      try {
        await User.update("c1", {});
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });
  
//   /************************************** remove */
  
  describe("remove", function () {
    test("works", async function () {
      await User.remove("test1");
      const res = await db.query(
          "SELECT * FROM users WHERE email='test1'");
      expect(res.rows.length).toEqual(0);
    });
  
    test("not found if no such user", async function () {
      try {
        await User.remove("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
  
