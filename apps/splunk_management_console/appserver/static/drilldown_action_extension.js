require([
    'jquery',
    'underscore',
    'views/managementconsole/instances/components/Action',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(
    $,
    _,
    ActionView,
    mvc,
    TableView
) {
    var TABLE_NAMES = ['drilldown_indexing_rate', 'drilldown_queue_fill_ratio', 
        'drilldown_page_fault', 'drilldown_lock_time', 'drilldown_network_traffic', 'drilldown_mapped_memory_ratio', 'drilldown_rep_latency', 'drilldown_primary_oplog_window', 'drilldown_background_flush', 
        'drilldown_search_concurrency', 'drilldown_resource_usage', 
        'drilldown_load_average', 'drilldown_cpu_usage', 'drilldown_memory_usage', 'drilldown_disk_usage', 'drilldown_iostats'];

    var initCellRender = function(tableView) {
        var ActionCellRenderer = TableView.BaseCellRenderer.extend({
            canRender: function(cell) {
                return cell.field === 'Action';
            },
            render: function($td, cell) {
                var actionValues = cell.value.split(' ');
                var instance = actionValues[0];
                var instanceRoles = actionValues.slice(1);
                var actionCell = new ActionView({
                    instance: instance,
                    earliest: tableView.model.get('dispatch.earliest_time'),
                    latest: tableView.model.get('dispatch.latest_time'),
                    roles: instanceRoles
                });
                actionCell.render().$el.appendTo($td);
            }
        });

        tableView.table.addCellRenderer(new ActionCellRenderer());
    };

    _.each(TABLE_NAMES, function(tableName) {
        var table = mvc.Components.get(tableName);
        if (table) {
            table.getVisualization(function(tableView) {
                initCellRender(tableView);
                tableView.table.render();
            });
        }
    });
});
