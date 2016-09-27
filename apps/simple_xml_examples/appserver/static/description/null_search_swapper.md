 Set tokens directly from the search manager to control behaviors on the page, enrich displays with search information, and more.  Each search that is dispatched by Splunk makes available a wide set of metadata around the search, the job, the server, and even the results.  This features enables developers to access and set tokens from that metadata to be used throughout the page.

**Custom Logic Using Eval Expressions in Search**

Leverage the new eval-based expression logic for both conditional matching as well as token setting.  Use this to define complex conditional matching, as well as token filtering/formatting.  
Allow the use of eval expressions in &lt;condition&gt; elements in event handlers.
``` simplexml
<condition match="[eval expression]>">
.. actions ... 
</condition>`
```
