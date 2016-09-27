#### Dashboard Data Sampling

Enable search sample ratio to efficiently retrieve a random sample of events from the search specified. This functionality is extremely useful for grabbing a smattering of events from an index over a large time range without having to uncompress and load all of the events.

* Search sample ratio can be leveraged both in the Search UI via the "Event Sampling" pulldown, as well as in dashboards using the following XML syntax.
* Enable using the sampleRatio tag within the search object, `<sampleRatio>100</sampleRatio>`
* The value, "100" represents the sample ratio "1/100". More specifically, the search will return 1 event for every 100 events that would otherwise be returned from search.

#### Search Syntax

```
<!-- add sampleRatio to the search object.  A value of "1000" equates to a sample ratio of "1/1000" -->
	
   <search id="mySearch">
      <query>index=_internal sourcetype=splunkd | timechart count</query>
      <earliest>-30d@d</earliest>
      <latest>now</latest>
      <sampleRatio>100</sampleRatio>
   </search>
```
