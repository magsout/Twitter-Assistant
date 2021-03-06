'use strict';

// bare minimum "polyfill" so this code doesn't crash when tested in a browser
if(!self.addon){
    self.addon = {
        port: {
            on: function(){},
            emit: function(ev, data){
                console.log("emitting", ev, data);
            }
        }
    }
}


const data = {
    automateTwitterAppCreation: e => self.addon.port.emit('automate-twitter-app-creation'),
    testCredentials: credentials => self.addon.port.emit('test-credentials', credentials)
};

function updatePanel(){
    React.renderComponent(TwitterAssistantPanel(data), document.body);
}


self.addon.port.on('update-logged-user', username => {
    data.loggedUser = username;
    updatePanel();
});

self.addon.port.on('working-app-credentials', credentials => {
    data.credentials = credentials;
    updatePanel();
});

/*
    1) Make sure automated case works
    2) Write code for "I want to make the app manually" & "I already have an app"
    3) think about "I want to change my credentials"
*/
//throw 'TODO: see above comment';

updatePanel();


/*

const apiCredentialsForm = document.body.querySelector('form.api-credentials');
const keyInput = apiCredentialsForm.querySelector('input.key');
keyInput.focus();
const secretInput = apiCredentialsForm.querySelector('input.secret');

const errorMessage = apiCredentialsForm.querySelector('.error')

const automaticInstructionsButton = document.body.querySelector('button.automatic');
const pleaseLogin = document.body.querySelector('.instructions.automatic .please-login')

const manualButton = document.body.querySelector('button.manual');

//const userCredentialsForm = document.body.querySelector('form.user-credentials');
//const usernameInput = userCredentialsForm.querySelector('input.username');
//const passwordInput = userCredentialsForm.querySelector('input.password');

const automaticButton = document.body.querySelector('.instructions.automatic button');


function hideError(){
    errorMessage.setAttribute('hidden', 'hidden');
    keyInput.removeEventListener('input', hideError);
    secretInput.removeEventListener('input', hideError);
}

function showError(){
    errorMessage.removeAttribute('hidden');
        
    keyInput.addEventListener('input', hideError);
    secretInput.addEventListener('input', hideError);
}

apiCredentialsForm.addEventListener('submit', e => {
    e.preventDefault();
    
    var key = keyInput.value,
        secret = secretInput.value;
    
    console.log('form submit', key, secret);
    
    if(!key || !secret || key.length <= 1 || secret.length <= 1)
        return; // ignore
    
    self.addon.port.emit('test-credentials', {key: key, secret: secret});
    
    // TODO add a spinner
});

//userCredentialsForm.addEventListener('submit', function submitListener(e){
//    self.addon.port.emit('automate-twitter-app-creation', {
//        username: usernameInput.value,
//        password: passwordInput.value
//    });
//} );

automaticInstructionsButton.addEventListener('click', e => {
    document.body.querySelector('.instructions.automatic').removeAttribute('hidden');
    document.body.querySelector('.instructions.manual').setAttribute('hidden', '');
    
    //if(userCredentialsForm.getAttribute('hidden') !== null){
        // form is hidden, we already have the password, no need to ask for it.
    //    self.addon.port.emit('automate-twitter-app-creation');
    //}
});

automaticButton.addEventListener('click', e => {
    self.addon.port.emit('automate-twitter-app-creation');
});

manualButton.addEventListener('click', e => {
    document.body.querySelector('.instructions.manual').removeAttribute('hidden');
    document.body.querySelector('.instructions.automatic').setAttribute('hidden', '');
});

self.addon.port.on('test-credentials-result', result => {
    var key = keyInput.value,
        secret = secretInput.value;
    
    console.log('test-credentials-result', result);
    
    // TODO remove spinner
    
    // parent context sends back the token if it's valid and whatever else otherwise
    if(Object(result) === result && result.key === key && result.secret === secret){
        self.addon.port.emit('confirm-credentials', result);
    }
    else{
        // can happen either if the token is invalid or the user change the input field
        showError();
    }
});




/*if(self.addon.options){
    keyInput.value = self.options.key;
    secretInput.value = self.options.secret;
}*/