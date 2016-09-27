The visualizations show two versions of the simple chart panel:

-   A columnar chart sourcetypes, stacked, over time for the last 24
    hours.
-   A columnar chart of the number of events of each sourcetype over the last 24 hours.

The example uses the `_internal` indexed data for convenience. It looks at the
sourcetype field to get an idea of what kind of data we have.

Charts can include a *title* parameter, displayed at the top of the
panel.

Both examples use the *earliestTime* timerange parameter to specify data
from the last 24 hours.

The **Categorical chart** shows a simple chart visualization. The
**Internal sourcetypes ...** chart enhances the data by specifying the
additional option parameters, *charting.chart* and
*charting.chart.stackMode*, all available using the **Visual Editor**.

From **Edit > Edit Panels**, click the Visualization Editing icons to experiment with
different chart visualization formats (line, area, bar, etc.). Click the Edit Properties
icons to view options for attributes and axes.
