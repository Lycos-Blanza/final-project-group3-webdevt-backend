// backend/api/index.js
const serverless = require("serverless-http");
const app = require("../server");

module.exports.handler = serverless(app, {
  request: (request, event, context) => {
    request.context = context;
  },
});