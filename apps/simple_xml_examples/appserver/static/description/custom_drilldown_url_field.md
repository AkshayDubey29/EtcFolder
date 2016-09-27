Take a url field value and configure drilldown to redirect users to that site.

How to integrate:

+ Load the custom javascript file `table_drilldown_url_field.js`.
+ Set a reference id within the table element (this example uses "link").
+ Within the javascript file, you need to reference the correct table element 
id as well as the column that you intend to configure for the drilldown.
+ Optionally configure the same or different column to serve as the drilldown link
(this example shows a separate column).
+ Optionally configure a link text or use the field value (this example shows how
to use generic link text).


