const express = require("express");
const apicache = require("apicache");
const morgan = require("morgan");
const { route1, route2 } = require("./routes.js");

const app = express();
const cache = apicache.middleware;

// adding morgan to log HTTP requests
app.use(morgan("combined"));

app.get("/api/ping", cache("30 minutes"), route1);

app.get("/api/posts/:tags/:sortBy?/:direction?", cache("30 minutes"), route2);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
