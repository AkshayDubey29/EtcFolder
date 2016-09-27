require([
	'underscore',
	'jquery',
	'backbone',
	'splunkjs/mvc/postprocessmanager',
	'splunkjs/mvc/searchmanager',
	'splunkjs/mvc/tableview',
	'splunkjs/mvc',
	'splunkjs/mvc/simplexml/ready!'
], function(
	_,
	$,
	Backbone,
	PostProcessManager,
	SearchManager,
	TableView,
	mvc
	) {
	var HTML_CELL_KPI_PERCENT_FILL_GOOD = _.template("<div class=\kpi-cell\"><span class=\"icon icon-check\"></span> <%= value %></div>");
	var HTML_CELL_KPI_PERCENT_FILL_OK = _.template("<div class=\kpi-cell\"><span class=\"icon icon-minus\"></span> <%= value %></div>");
	var HTML_CELL_KPI_PERCENT_FILL_BAD = _.template("<div class=\kpi-cell\"><span class=\"icon icon-x\"></span> <%= value %></div>");

	var FillPercMessageModel = Backbone.Model.extend({
		initialize: function() {
			var model = this; 

			// configure a post process to grab the max queue percentage fill within the last 10 minutes
			var postProcessManager = new PostProcessManager({
				search: "stats max(queue_fill_last_1min) as max_queue_fill_last_1min",
				managerid: "queue_fill_ratio_base",
				id: "fill_perc_post_process",
				auto_cancel: 90
            }, {tokens: true, tokenNamespace: "submitted"});

            postProcessManager.on("search:start", function() {
                model.clear();
            });

			postProcessManager.on("search:done", function(results) {
				var that = this;
				var kpiResultModel = that.data("results");

				kpiResultModel.on("data", function(results) {
					var max_percentage_fill = parseFloat(results.data().rows[0]);
					if(max_percentage_fill < 60) {
						model.set({status: 'healthy', icon_class: "alert-success", message: _("Queue fill ratio within the last 10 minutes is healthy for this instance").t() });
					} else if(max_percentage_fill >= 60) {
						model.set({status: 'bad', icon_class: "alert-error", message: _("Queue fill ratio within the last 10 minutes is degraded for this instance").t() });
					}
				});
			});
		}
	});

	var DNSLookupMessageModel = Backbone.Model.extend({
		initialize: function() {
			var SEARCH_QUERY = "`dmc_set_index_internal` splunk_server=$splunk_server$ sourcetype=splunkd source=*splunkd.log \"WARN\" TcpInputConfig \"reverse dns lookups appear to be excessively slow, this may impact receiving from network inputs.\"";

			var model = this;

            var searchManager = new SearchManager({
                id: 'dns-lookup-warning',
				search: SEARCH_QUERY, 
				earliest_time: "-60m",
            	latest_time: "now",
				autostart: true,
				auto_cancel: 90,
				cache: false,
				preview: true
			}, {tokens: true, tokenNamespace: "submitted"});

            searchManager.on('search:start', function() {
                model.clear();
            });

            searchManager.on('search:done', function(properties) {
				var numResults = properties.content.resultCount;
				if(numResults === 0) {
					model.set({status: 'healthy', icon_class: 'alert-success', message: _("There were no reverse DNS lookup warnings within the last hour for this instance").t()});
				} else if(numResults === 1) {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There was a reverse DNS lookup warning within the last hour for this instance").t()});
				} else if(numResults > 0) {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There was at least one reverse DNS lookup warning within the last hour for this instance").t()});
				}
			});
		}
	});

	var PortStatusKpiMessageModel = Backbone.Model.extend({
		initialize: function() {
			var SEARCH_QUERY = "`dmc_set_index_internal` splunk_server=$splunk_server$ sourcetype=splunkd source=*splunkd.log log_level=\"WARN\" component=TcpInputProc \"Stopping all listening ports.\"";

			var model = this;

			var searchManager = new SearchManager({
				id: 'port_status_search',
				search: SEARCH_QUERY,
				earliest_time: "-60m@m",
            	latest_time: "now",
            	autostart: true,
            	auto_cancel: 90,
				cache: false,
				preview: true
			}, {tokens: true, tokenNamespace: "submitted"});

            searchManager.on('search:start', function() {
                model.clear();
            });

			searchManager.on('search:done', function(properties) {
				var numResults = properties.content.resultCount;
				if(numResults === 0) {
					model.set({status: 'healthy', icon_class: 'alert-success', message: _("There were no Splunk TCP port closures due to queue blockages within the last hour for this instance").t()});
				} else if(numResults > 0) {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There were Splunk TCP port closures due to queue blockages within the last hour for this instance").t()});
				}
			});
		}
	});

	var KpiMessageCollection = Backbone.Collection.extend({
		initialize: function() {
			this.fillPercMessage = new FillPercMessageModel();
			this.dnsLookupMessage = new DNSLookupMessageModel();
			this.portStatusMessage = new PortStatusKpiMessageModel();

			this.push([this.fillPercMessage, this.dnsLookupMessage, this.portStatusMessage]);
		}

	});
	
	var KpiMessageView = Backbone.View.extend({
		template: _.template("<div class=\"alert <%= icon_class %>\">"+
			"<i class=\"icon-alert\"></i><h5><%= message %></h5>"+
			"</div>"),

		render: function() {
			this.$el.html(this.template({
				icon_class: this.model.get('icon_class'),
				message: this.model.get('message')
			}));
			return this;
		}
	});

	var KpiMessagesListView = Backbone.View.extend({
		className: "kpi-message-view",
		titleTemplate: _.template("<p class='kpi-list-view-title'>Health Check</p>"),

		initialize: function() {
			this.listenTo(this.collection, 'change', this.render);
		},

		render: function() {
			var html_body = "";
			var ratio_count = 0;

			this.collection.each(function(model) {
				if( model.get('icon_class') && model.get('message') ) {
					html_body += (new KpiMessageView({model: model})).render().$el.html();
				}
			});

			var html_title = this.titleTemplate();
			this.$el.html(html_title + "<div class=\"dmc-kpi-item\">"+html_body+"</div>"); 
		}
	});	

	var kpiMessageCollection = new KpiMessageCollection();
    var miscellaneousKpiMessagesList = new KpiMessagesListView({el: '#miscellaneous_kpi_panel .panel-body', collection: kpiMessageCollection});
});
