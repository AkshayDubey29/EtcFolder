
#### Nested Search Post-process

Built on the multi-search management logic introduced in Splunk Enterprise 6.2, users can now nest n-levels of post process searches for even more dashboard search optimization.

####How it works
* Global searches may be instantiated anywhere on the page (including within panels)
* Global searches (any search that you want to later perform a post process against) must include an "id" `<search id="globalSearch">...</search>`
* Explicitly bind a postprocess query to any search using a base="" and id="" for additional downstream queries `<search id="postProcess_1" base="globalSearch">...</search>`
* Continue referencing any search result using a base="" `<search base="postProcess_1">...</search>`

####Nested Search Post Process Syntax


```
	<!-- Example Nested Search Post Process -->
	
   <search id="globalSearch">
      <query>index=_internal | top sourcetype</query>
      <earliest>-60m@m</earliest>
      <latest>now</latest>
   </search>

   <search base="globalSearch" id="PostProcess_1">
      <query>search sourcetype=splunkd</query>
   </search>

   <search base="postProcess_1" id="postProcess_2">
    <query>| stats count</query>
   </search>
```