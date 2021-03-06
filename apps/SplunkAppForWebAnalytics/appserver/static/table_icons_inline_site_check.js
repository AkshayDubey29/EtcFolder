require([
    'underscore',
    'jquery',
    'splunkjs/mvc',
    'splunkjs/mvc/tableview',
    'splunkjs/mvc/simplexml/ready!'
], function(_, $, mvc, TableView) {

    var CustomIconRenderer = TableView.BaseCellRenderer.extend({
        canRender: function(cell) {
            return cell.field === 'Configured';
        },
        render: function($td, cell) {
            var site = cell.value;

            // Compute the icon base on the field value
            var icon;
            if(!site) {
                icon = 'alert-circle';
            } else {
                icon = 'check';
            }

            // Create the icon element and add it to the table cell
            $td.addClass('icon-inline').html(_.template('<i class="icon-<%-icon%>"></i>', {
                icon: icon,
                text: cell.value
            }));
        }
    });

    mvc.Components.get('available_sources_table').getVisualization(function(tableView){
        // Register custom cell renderer
        tableView.table.addCellRenderer(new CustomIconRenderer());
        // Force the table to re-render
        tableView.table.render();
    });

});