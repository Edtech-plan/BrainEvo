/**
 * Netlify Serverless Function - Express API
 * Wraps the Express app so it runs on Netlify Functions.
 */

// Tell main.js we are in serverless mode (no listen, optional top-level DB connect)
process.env.NETLIFY = '1';

const serverless = require('serverless-http');
const app = require('../../src/main');

exports.handler = serverless(app, {
  binary: ['image/*', 'application/pdf', 'application/zip'],
});
