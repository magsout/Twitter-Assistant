/// <reference path="../../defs/ES6.d.ts" />
/// <reference path="../../defs/react-0.11.d.ts" />
/// <reference path="../../defs/TwitterAPI.d.ts" />
/// <reference path="../../defs/jetpack/jetpack-port.d.ts" />

// declare var React : React.Exports;
'use strict';

declare var self : {
    // TODO document event interface
    port: JetpackPort
}


import TwitterAssistant = require('./components/TwitterAssistant');
import TweetMine = require('./TweetMine');

var ONE_DAY = 24*60*60*1000; // ms
var RIGHT_PROFILE_SIDEBAR_SELECTOR = '.ProfileSidebar .ProfileWTFAndTrends';

var twitterAssistantContainerP = <Promise<HTMLElement>> (new Promise<Document>( resolve => {
    document.addEventListener('DOMContentLoaded', function listener(){
        resolve(document);
        document.removeEventListener('DOMContentLoaded', listener);
    });
})).then(document => {
    var rightProfileSidebar = document.body.querySelector(RIGHT_PROFILE_SIDEBAR_SELECTOR);
    if(!rightProfileSidebar){
        var msg = ['No element matching (', RIGHT_PROFILE_SIDEBAR_SELECTOR ,'). No idea where to put the results :-('].join('');
        throw new Error(msg);
    }

    var twitterAssistantContainer = document.createElement('div');
    twitterAssistantContainer.classList.add('twitter-assistant-container');
    rightProfileSidebar.insertBefore(twitterAssistantContainer, rightProfileSidebar.firstChild);

    return twitterAssistantContainer;
})

twitterAssistantContainerP.catch(err => {
    console.error('twitterAssistantContainerP error', String(err));
});

var users = new Map<TwitterUserId, TwitterAPIUser>();
var timeline : TwitterAPITweet[] = [];
var currentUser : TwitterAPIUser;

function updateTwitterAssistant(){
    return twitterAssistantContainerP.then(twitterAssistantContainer => {
        React.renderComponent(TwitterAssistant({
            tweetMine: TweetMine(
                timeline,
                currentUser ? currentUser.screen_name : ''
            ),
            users: users,
            currentUser: currentUser,
            askUsers: function askUsers(userIds : TwitterUserId[]){
                self.port.emit('ask-users', userIds);
            }
        }), twitterAssistantContainer);
    }).catch(function(err){
        console.error('metrics integration error', String(err));
        throw err;
    });
}

self.port.on('answer-users', (receivedUsers: TwitterAPIUser[]) => {
    receivedUsers.forEach(u => users.set(u.id_str, u));

    updateTwitterAssistant();
});

self.port.on('current-user-details', currentUserDetails => {
    currentUser = currentUserDetails;

    updateTwitterAssistant();
});

self.port.on('twitter-user-data', _timeline => {
    timeline = _timeline;

    updateTwitterAssistant();
});


// Initial "empty" rendering ASAP so the user knows Twitter Assistant exists
updateTwitterAssistant();
