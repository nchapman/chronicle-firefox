var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;

tabs.on('ready', function (tab) {
  console.log('create visit', tab.url);

  // Create the request
  var request = Request({
    url: 'http://localhost:8080/visits.json',
    contentType: 'application/json',
    content: JSON.stringify({ visit: { url: tab.url } }),
  });

  // Post the request and ignore the response for now
  request.post();
});
