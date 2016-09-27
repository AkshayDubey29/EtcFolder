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
				managerid: "tcp_queue_fill_ratio_snapshot",
				id: "fill_perc_post_process",
				auto_cancel: 90
            }, {tokens: true, tokenNamespace: "submitted"});

            postProcessManager.on('search:start', function() {
                model.clear();
            });

			postProcessManager.on("search:done", function(results) {
				var that = this;
				var kpiResultModel = that.data("results");

				kpiResultModel.on("data", function(results) {
					var indexOfQueueFillRatioLast10Minutes = results.data().fields.indexOf("queue_fill_last_10min");
					var indexOfSplunkServer = results.data().fields.indexOf("splunk_server");

					var instances = [];
					_.each(results.data().rows, function(row) {
						if(parseFloat(row[indexOfQueueFillRatioLast10Minutes]) > 60) {
							instances.push(row[indexOfSplunkServer]);
						}
					});

					if(instances.length === 0) {
						model.set({status: 'healthy', icon_class: "alert-success", message: _("Queue fill ratio within the last 10 minutes is healthy for all instances").t() });
					} else {
						model.set({status: 'bad', icon_class: "alert-error", message: _("Queue fill ratio within the last 10 minutes is degraded on ").t() + instances.length + _(" instances").t() });	
					}
				});
			});
		}
	});

	var DNSLookupMessageModel = Backbone.Model.extend({
		initialize: function() {
			var SEARCH_QUERY = "`dmc_set_index_internal` search_group=dmc_group_indexer search_group=$group$ sourcetype=splunkd source=*splunkd.log \"WARN\" TcpInputConfig \"reverse dns lookups appear to be excessively slow, this may impact receiving from network inputs.\"";

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
					model.set({status: 'healthy', icon_class: 'alert-success', message: _("There were no reverse DNS lookup warnings within the last hour").t()});
				} else if(numResults === 1) {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There was a reverse DNS lookup warning within the last hour").t()});
				} else {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There were ").t() + numResults + _(" reverse DNS lookup warnings within the last hour").t()});
				}
			});
		}
	});

	var PortStatusKpiMessageModel = Backbone.Model.extend({
		initialize: function() {
			var SEARCH_QUERY = "`dmc_set_index_internal` search_group=dmc_group_indexer search_group=$group$ sourcetype=splunkd source=*splunkd.log log_level=\"WARN\" component=TcpInputProc \"Stopping all listening ports.\"";

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
					model.set({status: 'healthy', icon_class: 'alert-success', message: _("There were no Splunk TCP port closures due to queue blockages within the last hour").t()});
				} else if(numResults === 1) {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There was a Splunk TCP port closures due to queue blockages within the last hour").t()});
				} else {
					model.set({status: 'bad', icon_class: 'alert-error', message: _("There were ").t() + numResults + _(" Splunk TCP port closures due to queue blockages within the last hour").t()});
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

			this.$el.html(html_title + "<div class=\"dmc-kpi-item\">"+html_body+"<div>"); 
		}
	});	

	var kpiMessageCollection = new KpiMessageCollection();
	var miscellaneousKpiMessagesList = new KpiMessagesListView({el: '#miscellaneous_kpi_panel .panel-body', collection: kpiMessageCollection});

	var CustomCellRendererKpiFillPerc = TableView.BaseCellRenderer.extend({
		canRender: function(cellData) {
			return cellData.field == "Queue Fill Ratio (Last 1 Minute)" || cellData.field == "Queue Fill Ratio (Last 10 Minutes)";
		},
		render: function($td, cellData) {
			$td.addClass("numeric"); // class to align value right

			var parsedFloat = parseFloat(cellData.value).toFixed(2); // force two decimal places

			if(parsedFloat < 60) {
				$td.html(HTML_CELL_KPI_PERCENT_FILL_GOOD({value: parsedFloat}));
			} else if (parsedFloat >= 60 && parsedFloat < 80) {
				$td.html(HTML_CELL_KPI_PERCENT_FILL_OK({value: parsedFloat}));
			} else if (parsedFloat > 80) {
				$td.html(HTML_CELL_KPI_PERCENT_FILL_BAD({value: parsedFloat}));
			}
		}
	});

	mvc.Components.get("snapshotTcpInFillRatioTable").getVisualization(function(tableView) {
		tableView.table.addCellRenderer(new CustomCellRendererKpiFillPerc());
		tableView.table.render();
	});
});
