/// <reference path="../../defs/ES6.d.ts" />
/// <reference path="../../defs/react-0.11.d.ts" />
/// <reference path="../../defs/TwitterAPI.d.ts" />
/// <reference path="../../defs/jetpack/jetpack-port.d.ts" />
// declare var React : React.Exports;
'use strict';
var TwitterAssistant = require('./components/TwitterAssistant');
var TweetMine = require('./TweetMine');
var ONE_DAY = 24 * 60 * 60 * 1000; // ms
var RIGHT_PROFILE_SIDEBAR_SELECTOR = '.ProfileSidebar .ProfileWTFAndTrends';
var twitterAssistantContainerP = (new Promise(function (resolve) {
    document.addEventListener('DOMContentLoaded', function listener() {
        resolve(document);
        document.removeEventListener('DOMContentLoaded', listener);
    });
})).then(function (document) {
    var rightProfileSidebar = document.body.querySelector(RIGHT_PROFILE_SIDEBAR_SELECTOR);
    if (!rightProfileSidebar) {
        var msg = ['No element matching (', RIGHT_PROFILE_SIDEBAR_SELECTOR, '). No idea where to put the results :-('].join('');
        throw new Error(msg);
    }
    var twitterAssistantContainer = document.createElement('div');
    twitterAssistantContainer.classList.add('twitter-assistant-container');
    rightProfileSidebar.insertBefore(twitterAssistantContainer, rightProfileSidebar.firstChild);
    return twitterAssistantContainer;
});
twitterAssistantContainerP.catch(function (err) {
    console.error('twitterAssistantContainerP error', String(err));
});
var users = new Map();
var timeline = [];
var currentUser;
function updateTwitterAssistant() {
    return twitterAssistantContainerP.then(function (twitterAssistantContainer) {
        React.renderComponent(TwitterAssistant({
            tweetMine: TweetMine(timeline, currentUser ? currentUser.screen_name : ''),
            users: users,
            currentUser: currentUser,
            askUsers: function askUsers(userIds) {
                self.port.emit('ask-users', userIds);
            }
        }), twitterAssistantContainer);
    }).catch(function (err) {
        console.error('metrics integration error', String(err));
        throw err;
    });
}
self.port.on('answer-users', function (receivedUsers) {
    receivedUsers.forEach(function (u) { return users.set(u.id_str, u); });
    updateTwitterAssistant();
});
self.port.on('current-user-details', function (currentUserDetails) {
    currentUser = currentUserDetails;
    updateTwitterAssistant();
});
self.port.on('twitter-user-data', function (_timeline) {
    timeline = _timeline;
    updateTwitterAssistant();
});
// Initial "empty" rendering ASAP so the user knows Twitter Assistant exists
updateTwitterAssistant();
//# sourceMappingURL=main.js.map