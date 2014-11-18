var tabs = require('sdk/tabs');
var { ActionButton } = require('sdk/ui/button/action');
var Request = require('sdk/request').Request;
var prefs = require('sdk/simple-prefs').prefs

// Button states
var saveState = {
  label: 'Save for later',
  icon: {
    '16': './images/share_16.png',
    '32': './images/share_32.png',
    '64': './images/share_64.png'
  }
};

var unsaveState = {
  label: "Don't save for later",
  icon: {
    '16': './images/share_active_16.png',
    '32': './images/share_active_32.png',
    '64': './images/share_active_64.png'
  }
};

// Like action button
var button = ActionButton({
  id: 'chronicle-save',
  label: saveState.label,
  icon: saveState.icon,

  onClick: function(state) {
    var tab = tabs.activeTab;

    // Switch state based on the label
    if (state.label === saveState.label) {
      createLike(tab);

      button.state('tab', unsaveState);
    } else {
      deleteLike(tab);

      button.state('tab', saveState);
    }
  }
});

function createLike(tab) {
  console.log('create save', tab.url);

  Request({
    url: prefs.host + 'saves.json',
    contentType: 'application/json',
    content: JSON.stringify({ save: { url: tab.url, title: tab.title } }),
  }).post();
}

function deleteLike(tab) {
  console.log('delete save', tab.url, tab.title);

  Request({
    url: prefs.host + 'saves.json',
    contentType: 'application/json',
    content: JSON.stringify({ save: { url: tab.url, title: tab.title } }),
  }).delete();
}

// Listen for tab ready and update save button state
tabs.on('ready', function(tab) {
  // Check to see if this tab has been saved
  Request({
    url: prefs.host + 'saves/exists.json',
    contentType: 'application/json',
    content: JSON.stringify({ save: { url: tab.url, title: tab.title } }),
    onComplete: function (response) {
      console.log("save exists?", tab.url, response.json);

      // If it exists
      if (response.json) {
        button.state(tab, unsaveState);
      } else {
        button.state(tab, saveState);
      }
    }
  }).post();
});
