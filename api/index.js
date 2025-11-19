// backend/api/index.js
const serverless = require("serverless-http");
const app = require("../server");

exports.handler = serverless(app);