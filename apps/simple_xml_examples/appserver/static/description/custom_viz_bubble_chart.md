The Bubble Chart visualization allows you to quickly plot the magnitude
of a given field as the size of a bubble. It also lets you categorize
fields by color grouping. This example shows how to
integrate a D3 bubble chart into a simple xml dashboard.

How to integrate this custom visualization into your deployment and/or
app:

+ Load the following `autodiscover.js` into your app's appserver/static directory.
+ Load all required source files for the d3 bubble chart. You can find these in
  `$SPLUNK_HOME$/etc/apps/simple_xml_examples/appserver/static/components/bubblechart/`.
+ Add an html element to your simple xml dashboard.
+ Use similar `<div />` tags to instantiate your custom viz, as well as the search to drive it.
+ Note that you must bind the custom viz to the search manager, denoted by `"managerid"`
    -   The "managerid" is bound to the "id" of the searchmanager in the following example.
- Also make sure to reference the correct path to your custom viz source
  files (`data-require`)

For additional information on using the splunkjs searchmanager,
refer to the Splunk Web Framework Reference Manual.

