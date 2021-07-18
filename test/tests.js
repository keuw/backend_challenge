const expect = require("chai").expect;
const axios = require("axios");
const request = require("supertest");

const requests = request("http://localhost:3000");

describe("Backend Assessment Blog Posts", () => {
    describe("GET /api/ping", () => {
        it("Should return success object true", (done) => {
            requests
                .get("/api/ping")
                .expect(200)
                .expect((res) => (res.body.success = "true"));
            done();
        });
    });
    describe("GET /api/posts", () => {
        it("Should return unique set of ids for posts", (done) => {
            axios
                .get("http://localhost:3000/api/posts/tech,history,health")
                .then((res) => {
                    let posts = res.data;
                    let idSet = {};
                    let test = true;

                    for (let i = 0; i < posts.length; i++) {
                        if (posts[i].id in idSet) {
                            test = false;
                        } else {
                            idSet[posts[i].id] = true;
                        }
                    }
                    expect(test).to.equal(true);
                    done();
                })
                .catch((error) => {
                    console.log(error);
                });
        });
        it("Should return set of posts in sorted order", (done) => {
            axios
                .get(
                    "http://localhost:3000/api/posts/tech,history,health,science/likes/desc"
                )
                .then((res) => {
                    let posts = res.data;
                    let test = true;
                    for (let i = 0; i < posts.length - 1; i++) {
                        if (posts[i].likes < posts[i + 1].likes) {
                            test = false;
                        }
                    }
                    expect(test).to.equal(true);
                    done();
                })
                .catch((error) => {
                    console.log(error);
                });
        });
    });
});
