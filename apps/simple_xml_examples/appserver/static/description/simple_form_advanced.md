Form inputs can be further customized using various advanced controls.

+ Auto-Run:
    -   `<fieldset autorun="True">`
    -   Runs the search when the page loads.

+ Submit Button:
    -   `<fieldset submitButton="False">`
    -   Hides the submit button from form inputs.

+ Search When Changed:
    -   `<input searchWhenChanged="True">`
    -   Runs the search when form input selection is changed.

+ Dynamically Populate Form Input Options
    - `<populatingSearch fieldForValue="user" fieldForLabel="user" earliest="-24h" latest="now"><![CDATA[index=_internal | stats count by user]]></populatingSearch>`
    - Populates the form input's options using results of the populating search.

For additional information, refer to the Simple XML Reference:
[Form inputs](http://docs.splunk.com/Documentation/Splunk/latest/Viz/PanelreferenceforSimplifiedXML#Form_inputs)
