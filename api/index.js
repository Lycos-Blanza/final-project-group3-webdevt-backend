// backend/api/index.js   ← NEW FILE
const express = require('express');
const serverless = require('serverless-http');
require('dotenv').config();

// Import your existing server setup
require('../server'); // This loads your server.js (or whatever your main file is)

// Get the already-created Express app from server.js
// You must export the app in server.js — see step 2
const app = require('../server').app;

const handler = serverless(app);

module.exports.handler = handler;