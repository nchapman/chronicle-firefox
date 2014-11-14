var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;
var prefs = require('sdk/simple-prefs').prefs

tabs.on('ready', function (tab) {
  console.log('create visit', tab.url);

  createVisit(tab);
});

function createVisit(tab) {
  if (prefs.enableVisits) {
    Request({
      url: prefs.host + 'visits.json',
      contentType: 'application/json',
      content: JSON.stringify({ visit: { url: tab.url, title: tab.title } }),
    }).post();
  }
}
