var tabs = require('sdk/tabs');
var Request = require('sdk/request').Request;
var prefs = require('sdk/simple-prefs').prefs
var timers = require('sdk/timers');

var IGNORE_PATTERN = /(^about:)|(google\.com\/url)/i

// Push state tracking is experimental and could be harmful
if (prefs.enablePushStateTracking) {
  tabs.on('ready', function (tab) {
    // Clear previous timer
    timers.clearTimeout(tab.urlWatchTimer);

    // Create this visit
    createVisit(tab);

    // Watch for url changes triggered by pushState
    var lastUrl = tab.url;

    tab.urlWatchTimer = timers.setInterval(function() {
      if (lastUrl != tab.url) {
        createVisit(tab);
        lastUrl = tab.url;
      }
    }, 1000);
  });

  tabs.on('close', function (tab) {
    timers.clearTimeout(tab.urlWatchTimer);
  });
} else {
  tabs.on('ready', createVisit);
}

function createVisit(tab) {
  if (prefs.enableVisits && !tab.url.match(IGNORE_PATTERN)) {
    console.log('create visit', tab.url);

    Request({
      url: prefs.host + 'visits.json',
      contentType: 'application/json',
      content: JSON.stringify({ visit: { url: tab.url, title: tab.title } }),
    }).post();
  }
}
