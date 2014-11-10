var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;

tabs.on('ready', function (tab) {
  console.log('create visit', tab.url);

  createVisit(tab.url);
});

function createVisit(url) {
  Request({
    url: 'http://localhost:8080/visits.json',
    contentType: 'application/json',
    content: JSON.stringify({ visit: { url: url } }),
  }).post();
}
