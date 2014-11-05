var tabs = require('sdk/tabs');
var { ActionButton } = require('sdk/ui/button/action');
var Request = require('sdk/request').Request;

// Button states
var likeState = {
  label: 'Like',
  icon: {
    '16': './images/open_heart_16.png',
    '32': './images/open_heart_32.png'
  }
};

var unlikeState = {
  label: 'Unlike',
  icon: {
    '16': './images/full_heart_16.png',
    '32': './images/full_heart_32.png'
  }
};

// Like action button
var button = ActionButton({
  id: 'chronicle-like',
  label: likeState.label,
  icon: likeState.icon,

  onClick: function(state) {
    var tab = tabs.activeTab;

    // Switch state based on the label
    if (state.label === 'Like') {
      createLike(tab);

      button.state('tab', unlikeState);
    } else {
      deleteLike(tab);

      button.state('tab', likeState);
    }
  }
});

function createLike(tab) {
  console.log('create like', tab.url);

  Request({
    url: 'http://localhost:8080/likes.json',
    contentType: 'application/json',
    content: JSON.stringify({ like: { url: tab.url } }),
  }).post();
}

function deleteLike(tab) {
  console.log('delete like', tab.url, tab.title);

  Request({
    url: 'http://localhost:8080/likes.json',
    contentType: 'application/json',
    content: JSON.stringify({ like: { url: tab.url } }),
  }).delete();
}

// Listen for tab ready and update like button state
tabs.on('ready', function(tab) {
  // Check to see if this tab has been liked
  Request({
    url: 'http://localhost:8080/likes/exists.json',
    contentType: 'application/json',
    content: JSON.stringify({ like: { url: tab.url } }),
    onComplete: function (response) {
      console.log("like exists?", tab.url, response.json);

      // If it exists
      if (response.json) {
        button.state(tab, unlikeState);
      } else {
        button.state(tab, likeState);
      }
    }
  }).post();
});