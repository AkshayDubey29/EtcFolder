require([
    'underscore',
    'jquery',
    'backbone',
    'views/managementconsole/overview/Alerts',
    'splunkjs/mvc/sharedmodels',
    'splunkjs/mvc/simplexml/ready!'
], function(
    _,
    $,
    Backbone,
    AlertsView,
    SharedModels){


    // Init objects
    var model = {};

    model.serverInfoModel = SharedModels.get('serverInfo');
    $.when(model.serverInfoModel.dfd).then(function() {

        // Create the alert view and attach to the dashboard
        var alertsView = new AlertsView({
            model: {
                serverInfo: model.serverInfoModel
            }
        });

        $('.dmc-alerts-section').append(alertsView.render().$el);

    });


});
