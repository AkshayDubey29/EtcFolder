require([
    'splunkjs/mvc',
    'splunk.config',
    'splunkjs/mvc/simplexml/ready!'
], function(mvc, SplunkConfig) {

    var unsubmittedTokens = mvc.Components.getInstance('default');
    var submittedTokens = mvc.Components.getInstance('submitted');

    // Set the token $currentUser$ to the name of the currently logged in user
    var username = SplunkConfig['USERNAME'];
    unsubmittedTokens.set('currentUser', username);
    submittedTokens.set('currentUser', username);

});