const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  test1Token,
  test2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users */

describe("POST /users", function () {
  test("works for admins: create non-admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          email: "u-new",
          password: "password",
          name: "Last-newL",
          department: "td1",
          position: "tester",
          location: "hq",
          isAdmin: false,
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      "user": {
        "email": "u-new",
        "name": "Last-newL",
        "department": "td1",
        "position": "tester",
        "location": "hq",
        "isadmin": false
      }, token: expect.any(String),
    });
  });

  test("works for admins: create admin", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          email: "u-new1",
          password: "password",
          name: "Last-newL",
          department: "td1",
          position: "tester",
          location: "hq",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      user: {
        "email": "u-new1",
        "name": "Last-newL",
        "department": "td1",
        "position": "tester",
        "location": "hq",
        "isadmin": true,
      }, token: expect.any(String),
    });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          email: "u-new2",
          password: "password",
          name: "Last-newL",
          department: "td1",
          position: "tester",
          location: "hq",
          isAdmin: true,
        })
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          email: "u-new3",
          password: "password",
          name: "Last-newL",
          department: "td1",
          position: "tester",
          location: "hq",
          isAdmin: true,
        });
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
        .post("/users")
        .send({
          email: "u-new",
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /users */

describe("GET /users", function () {
  test("works for admins", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body.users.length).toEqual(2);
  });

  test("unauth for non-admin users", async function () {
    const resp = await request(app)
        .get("/users")
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get("/users");
    expect(resp.statusCode).toEqual(401);
  });
});

/************************************** GET /users/:username */

describe("GET /users/:username", function () {
  test("works for admin", async function () {
    const resp = await request(app)
        .get(`/users/test2`)
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body).toEqual({
      "user": {
        "email": "test2",
        "name": "tester2",
        "department": "td2",
        "position": "janitor",
        "location": "hq",
        "isadmin": false
      }
    });
  });

  test("works for same user", async function () {
    const resp = await request(app)
        .get(`/users/test2`)
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.body).toEqual({
      "user": {
        "email": "test2",
        "name": "tester2",
        "department": "td2",
        "position": "janitor",
        "location": "hq",
        "isadmin": false
      }
    });
  });

  test("unauth for other users", async function () {
    const resp = await request(app)
        .get(`/users/test1`)
        .set("authorization", `Bearer ${test2Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
        .get(`/users/test2`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user not found", async function () {
    const resp = await request(app)
        .get(`/users/nope`)
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});

// /************************************** PATCH /users/:username */

describe("PATCH /users/:username", () => {
  test("works for admins", async function () {
    const resp = await request(app)
        .patch(`/users/test2`)
        .send({
          name: "New",
        })
        .set("authorization", `Bearer ${test1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "u1",
        firstName: "New",
        lastName: "U1L",
        email: "user1@user.com",
        isAdmin: false,
      },
    });
  });

  // test("works for same user", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/u1`)
  //       .send({
  //         firstName: "New",
  //       })
  //       .set("authorization", `Bearer ${u1Token}`);
  //   expect(resp.body).toEqual({
  //     user: {
  //       username: "u1",
  //       firstName: "New",
  //       lastName: "U1L",
  //       email: "user1@user.com",
  //       isAdmin: false,
  //     },
  //   });
  // });

  // test("unauth if not same user", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/u1`)
  //       .send({
  //         firstName: "New",
  //       })
  //       .set("authorization", `Bearer ${u2Token}`);
  //   expect(resp.statusCode).toEqual(401);
  // });

  // test("unauth for anon", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/u1`)
  //       .send({
  //         firstName: "New",
  //       });
  //   expect(resp.statusCode).toEqual(401);
  // });

  // test("not found if no such user", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/nope`)
  //       .send({
  //         firstName: "Nope",
  //       })
  //       .set("authorization", `Bearer ${test1Token}`);
  //   expect(resp.statusCode).toEqual(404);
  // });

  // test("bad request if invalid data", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/u1`)
  //       .send({
  //         firstName: 42,
  //       })
  //       .set("authorization", `Bearer ${test1Token}`);
  //   expect(resp.statusCode).toEqual(400);
  // });

  // test("works: can set new password", async function () {
  //   const resp = await request(app)
  //       .patch(`/users/u1`)
  //       .send({
  //         password: "new-password",
  //       })
  //       .set("authorization", `Bearer ${test1Token}`);
  //   expect(resp.body).toEqual({
  //     user: {
  //       username: "u1",
  //       firstName: "U1F",
  //       lastName: "U1L",
  //       email: "user1@user.com",
  //       isAdmin: false,
  //     },
  //   });
  //   const isSuccessful = await User.authenticate("u1", "new-password");
  //   expect(isSuccessful).toBeTruthy();
  // });
});

// /************************************** DELETE /users/:username */

// describe("DELETE /users/:username", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .delete(`/users/u1`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .delete(`/users/u1`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ deleted: "u1" });
//   });

//   test("unauth if not same user", async function () {
//     const resp = await request(app)
//         .delete(`/users/u1`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .delete(`/users/u1`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found if user missing", async function () {
//     const resp = await request(app)
//         .delete(`/users/nope`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });

// /************************************** POST /users/:username/jobs/:id */

// describe("POST /users/:username/jobs/:id", function () {
//   test("works for admin", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("works for same user", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${u1Token}`);
//     expect(resp.body).toEqual({ applied: testJobIds[1] });
//   });

//   test("unauth for others", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${u2Token}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("unauth for anon", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/${testJobIds[1]}`);
//     expect(resp.statusCode).toEqual(401);
//   });

//   test("not found for no such username", async function () {
//     const resp = await request(app)
//         .post(`/users/nope/jobs/${testJobIds[1]}`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("not found for no such job", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/0`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });

//   test("bad request invalid job id", async function () {
//     const resp = await request(app)
//         .post(`/users/u1/jobs/0`)
//         .set("authorization", `Bearer ${test1Token}`);
//     expect(resp.statusCode).toEqual(404);
//   });
// });
