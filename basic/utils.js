'use strict';

const request = require('request');
async function sleep(seconds) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000);
  });
}

async function syncRequest(url, method, body) {
  let options = {
    url: url,
    method: method,
    json: true,
    body: body,
  };
  return new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

module.exports = {
  sleep: sleep,
  request: syncRequest,
};
