Dashboard display controls for header, footer, and edit functions for easy iFrame embedding.

### How it Works

- Optionally control individual elements via http get params, or as top-level attributes within simple XML.
 - Configure as top-level simple XML attributes to always render the dashboard with these hidden elements.
 - Control via get param for easy iFrame embedding, but still allow users to escape to a full experience.
- New attributes/parameters available
 - `hideSplunkBar` - hides just the splunkbar.
 - `hideAppBar` - hides just the appbar.
 - `hideFooter` - hides just the footer.
 - `hideChrome` - shortcut to hide splunkbar, appbar, and footer.
 - `hideTitle` - hides title and description.
 - `hideEdit` - hides all the dashboard controls.
- Note that http get param takes precedence for any control conflicts.

Syntax for using Simple XML Attributes
```
<form hideSplunkBar="true" hideEdit="true">
   ...
</form>
```

Syntax exercising these display controls via get param
```
http://mySplunkInstance:8000en-US/app/splunk_6_2_overview/view_name?hideSplunkBar=true&hideFooter=true
```