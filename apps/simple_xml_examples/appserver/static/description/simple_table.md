This `Table Element` example is a simple tabular listing of the number
of occurences of the top 100 sourcetypes.

Click **Edit > Edit Panels**. Then click the Table Edit icon. Notice that the **Statistics Table** type
of visualization is selected and displayed as a recommended visualization. Column, Bar, and Pie are
also recommended visualizations for this data.

For convenience, the example searches for sourcetypes in the `_internal` index, for
the last 24 hours:

     index=_internal | top limit=100 sourcetype | eval percent = round(percent,2)

The search results return the number of sourcetype occurrences and the
percentage of total occurrences.

In addition to the `<search>` node the following parameters
are also used, which are common to all view groups:

-   `<title>`

The option parameters specific to the `Table` view group:

-   `wrap`

    Set `wrap` to `true` to wrap the content.

-   `rowNumbers`

    Include a line number with each table row. You can see row numbers
    in the left-most column, if `rowNumbers` is set to `true`.

-   `dataOverlayMode`

    Choose a `heatmap`, `highlow`, or no overlay on the displayed
    results. This example uses no overlay, `none`.

-   `drilldown`

    Choose whether or not you can drilldown for more information when you
    click a particular table cell. You can specify no drilldown
    functionality, `none`; drilldown by clicking anywhere on the table,
    `all`; or drilldown by clicking a table, `cell`. This example permits `cell`
    drilldown, which is not currently implemented.

-   `count`

    Specify the number of rows to display per page. This example
    displays the default, `10`, which is ten rows per page.

Click the Edit icons for the table to modify this example and observe
the results of your changes. You can also experiment by clicking the
**Edit Source** button to edit the XML code that underlies this simple
XML example.
