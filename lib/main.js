require('sdk/tabs').on('ready', logURL);
var Request = require("sdk/request").Request;

function logURL(tab) {
  console.log('chronicle: logging url', tab.url);

  Request({
    url: 'http://localhost:8080/visits.json',
    contentType: 'application/json',
    content: JSON.stringify({ visit: { url: tab.url } }),
    anonymous: false
  }).post();
}
