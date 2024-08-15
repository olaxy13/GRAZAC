const request = require("supertest");
const app = require("../app");

describe("API Endpoints", () => {
  it("should call /test", async () => {
    const res = await request(app).get("/test");
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toEqual(true);
  });
});