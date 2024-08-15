const request = require("supertest");
const app = require("../app");
const httpStatus = require("http-status");
const setupTestDB = require("../utils/test_utils/setUpTestDb");
const { emailService } = require("../services");
const { insertUsers } = require("../utils/test_utils/factory");

setupTestDB();

describe("Auth routes", () => {
  let newUser;
  beforeEach(() => {
    jest.mock("nodemailer");
    newUser = {
      password: "password1",
      confirmPassword: "password1",
      name: "test(",
      lastName: "resf",
      email: "test@gmail.com",
    };
    jest.spyOn(emailService.transport, "sendMail").mockResolvedValue();
  });
  describe("POST /api/user/signup", () => {
    test("should return 201 and successfully register user if request data is ok", async () => {
      const res = await request(app)
        .post("/api/user/signup")
        .send(newUser)
        .expect(httpStatus.CREATED);
      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe("test@gmail.com");
    });
    test("should return 400 error if email already exist", async () => {
      newUser.email = "duplicatetest@gmail.com";
      const res = await request(app)
        .post("/api/user/signup")
        .send(newUser)
        .expect(httpStatus.CREATED);
      expect(res.status).toBe(httpStatus.CREATED);
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user.email).toBe("duplicatetest@gmail.com");
      newUser.email = "duplicatetest@gmail.com";
      const duplicateRes = await request(app)
        .post("/api/user/signup")
        .send(newUser)
        .expect(httpStatus.BAD_REQUEST);
      expect(duplicateRes.body.message).toBe("Email already exists");
    });
  });
  describe("POST /api/user/login", () => {
    test("should return 200 and login user if email and password match", async () => {
      newUser.email = "login@email.com";
      newUser.isVerified = true;

      await insertUsers([newUser]);
      const loginCredentials = {
        email: newUser.email,
        password: newUser.password,
      };
      const res = await request(app)
        .post("/api/user/login")
        .send(loginCredentials)
        .expect(httpStatus.OK);
      expect(res.body.status).toBe("success");
      expect(res.body.token).toBeDefined();
      expect(res.body.data.user).toEqual({
        _id: expect.anything(),
        isVerified: true,
        name: newUser.name,
        email: newUser.email,
        password: expect.anything(),
        __v: expect.anything(),
      });
    });
    test("should return 401 error if there are no users with that email", async () => {
      const loginCredentials = {
        email: "randomemail@gmail.com",
        password: "random",
      };

      const res = await request(app)
        .post("/api/user/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual({
        message: "Incorrect email or password",
      });
    });

    test("should return 401 error if password is wrong", async () => {
      newUser.email = "vaild@email.com";
      await insertUsers([newUser]);
      const loginCredentials = {
        email: newUser.email,
        password: "wrongPassword1",
      };
      const res = await request(app)
        .post("/api/user/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({
        message: "Incorrect email or password",
      });
    });

    test("should return 401 error if account is not verified", async () => {
      newUser.email = "vaild2@email.com";
      newUser.isVerified = false;
      await insertUsers([newUser]);
      const loginCredentials = {
        email: newUser.email,
        password: newUser.password,
      };
      const res = await request(app)
        .post("/api/user/login")
        .send(loginCredentials)
        .expect(httpStatus.UNAUTHORIZED);
      expect(res.body).toEqual({
        message: "User not verified yet",
      });
    });
  });
});
